import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import styles from './MyPage.module.css';

interface MyPageProps {
  profile: any;
  onBack: () => void;
  onProfileUpdate: () => void;
  onLogout: () => void;
}

const MyPage: React.FC<MyPageProps> = ({ profile, onBack, onProfileUpdate, onLogout }) => {
  const { session } = useAuth();
  const [nickname, setNickname] = useState(profile?.nickname || '');
  const [gender, setGender] = useState(profile?.gender || 'male');
  const [age, setAge] = useState(profile?.age?.toString() || '');
  const [mbti, setMbti] = useState(profile?.mbti || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [stats, setStats] = useState({ totalAnalyses: 0, avgScore: 0 });
  const [recentReports, setRecentReports] = useState<any[]>([]);
  
  // Withdrawal states
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const withdrawalReasons = [
    "분석 결과가 정확하지 않아요",
    "더 이상 서비스가 필요 없어요",
    "사용 방법이 너무 어려워요",
    "개인정보 유출이 걱정돼요",
    "기타 (직접 입력)"
  ];

  useEffect(() => {
    fetchStats();
    fetchRecentReports();
  }, []);

  const fetchStats = async () => {
    if (!session?.user) return;
    
    const { data, count, error } = await supabase
      .from('analyses')
      .select('score_total', { count: 'exact' })
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching stats:', error);
      return;
    }

    const totalAnalyses = count || 0;
    const avgScore = totalAnalyses > 0 
      ? Math.round(data.reduce((acc, curr) => acc + curr.score_total, 0) / totalAnalyses) 
      : 0;

    setStats({ totalAnalyses, avgScore });
  };

  const fetchRecentReports = async () => {
    if (!session?.user) return;
    const { data, error } = await supabase
      .from('analyses')
      .select('*, counterparts(nickname)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (!error && data) {
      setRecentReports(data);
    }
  };

  const getRelationshipStyle = (score: number) => {
    if (score === 0 && stats.totalAnalyses === 0) return "데이터 부족";
    if (score >= 80) return "직진형 사랑꾼";
    if (score >= 60) return "적극적인 탐색가";
    if (score >= 40) return "신중한 관찰자";
    return "철벽 방어 기제";
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    
    setIsUpdating(true);
    try {
      const updateData: any = {
        nickname,
        gender,
        age: parseInt(age) || 0,
        mbti: mbti || null
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', session.user.id);

      if (error) throw error;
      
      alert('프로필이 업데이트되었습니다.');
      onProfileUpdate();
    } catch (err: any) {
      console.error('Error updating profile:', err);
      alert(`업데이트 실패: ${err.message || '데이터베이스 컬럼(MBTI 등)이 생성되었는지 확인해주세요.'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const handleWithdrawal = async () => {
    if (!session?.user) return;
    if (!selectedReason) {
      alert('탈퇴 사유를 선택해주세요.');
      return;
    }

    setIsWithdrawing(true);
    try {
      console.log('Initiating withdrawal for user:', session.user.id);

      // 프로필만 삭제하면, DB에 설정된 ON DELETE CASCADE에 의해 모든 하위 데이터(analyses, counterparts)가 자동 삭제됩니다.
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', session.user.id);

      if (profileError) {
        console.error('Failed to delete profile:', profileError);
        throw new Error('프로필 삭제 중 오류가 발생했습니다. (RLS 정책 확인 필요)');
      }

      // 4. 로그아웃 처리
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Failed to sign out:', signOutError);
      }

      alert('회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.');
      onLogout();
    } catch (err: any) {
      console.error('Error during withdrawal:', err);
      alert(err.message || '탈퇴 처리 중 예상치 못한 오류가 발생했습니다.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className={styles.title}>마이페이지</h1>
      </header>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className="material-symbols-outlined">person</span>
          프로필 관리
        </h2>
        <form onSubmit={handleUpdateProfile}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div className={styles.avatarLarge}>
              {nickname.substring(0, 1).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#8a2be2', fontWeight: 'bold', marginBottom: '4px' }}>
                {getRelationshipStyle(stats.avgScore)}
              </div>
              <div style={{ fontSize: '13px', color: '#999' }}>
                {stats.totalAnalyses}번의 분석을 기반으로 도출된 성향입니다.
              </div>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>닉네임</label>
            <input 
              className={styles.input}
              value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          placeholder="닉네임을 입력하세요"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '16px' }}>
              
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>성별</label>
              <select className={styles.select} value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="male">남성</option>
                <option value="female">여성</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>나이</label>
              <input 
                type="number"
                className={styles.input}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.label}>MBTI</label>
              <select className={styles.select} value={mbti} onChange={(e) => setMbti(e.target.value)}>
                <option value="">선택 안함</option>
                {['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          <button className={styles.saveBtn} disabled={isUpdating}>
            {isUpdating ? '저장 중...' : '변경사항 저장'}
          </button>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className="material-symbols-outlined">monitoring</span>
          분석 통계 요약
        </h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.totalAnalyses}회</span>
            <span className={styles.statLabel}>총 분석 횟수</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{stats.avgScore}점</span>
            <span className={styles.statLabel}>평균 시그널 점수</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{profile?.is_subscribed ? 'PRO' : 'FREE'}</span>
            <span className={styles.statLabel}>현재 플랜</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className="material-symbols-outlined">history</span>
          최근 분석 리포트
        </h2>
        {recentReports.length > 0 ? (
          recentReports.map(report => (
            <div key={report.id} className={styles.reportItem}>
              <div>
                <div className={styles.reportNickname}>{report.counterparts?.nickname}님과의 분석</div>
                <div className={styles.reportDate}>{new Date(report.created_at).toLocaleDateString()}</div>
              </div>
              <div className={styles.reportScore}>{report.score_total}점</div>
            </div>
          ))
        ) : (
          <p style={{ color: '#999', textAlign: 'center', fontSize: '14px' }}>아직 분석 기록이 없습니다.</p>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.menuItem}>
          <span className={styles.menuText}>이메일 계정</span>
          <span className={styles.menuValue}>{session?.user.email}</span>
        </div>
        <div className={styles.menuItem} onClick={() => alert('구독 관리 - 준비 중')}>
          <span className={styles.menuText}>구독 및 결제 관리</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#ccc' }}>chevron_right</span>
        </div>
        <div className={styles.menuItem} onClick={() => alert('알림 설정 - 준비 중')}>
          <span className={styles.menuText}>알림 설정</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#ccc' }}>chevron_right</span>
        </div>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          로그아웃
        </button>
        <button className={styles.withdrawBtn} onClick={() => setShowWithdrawalModal(true)}>
          회원 탈퇴
        </button>
      </div>

      {/* 회원 탈퇴 모달 */}
      {showWithdrawalModal && (
        <div className={styles.modalOverlay} onClick={() => setShowWithdrawalModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>정말 탈퇴하시겠습니까?</h2>
            <div className={styles.warningBox}>
              <span className="material-symbols-outlined" style={{ color: '#ff4d4f' }}>warning</span>
              <p>탈퇴 시 지금까지의 모든 분석 결과, 프로필 정보, 구독 내역이 <strong>즉시 삭제되며 복구할 수 없습니다.</strong></p>
            </div>
            
            <div className={styles.reasonSection}>
              <p className={styles.reasonLabel}>탈퇴 사유를 알려주세요 (필수)</p>
              {withdrawalReasons.map((reason) => (
                <label key={reason} className={styles.radioOption}>
                  <input 
                    type="radio" 
                    name="withdrawalReason" 
                    value={reason} 
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setShowWithdrawalModal(false)}
                disabled={isWithdrawing}
              >
                취소
              </button>
              <button 
                className={styles.confirmWithdrawBtn} 
                onClick={handleWithdrawal}
                disabled={isWithdrawing || !selectedReason}
              >
                {isWithdrawing ? '처리 중...' : '탈퇴하기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
