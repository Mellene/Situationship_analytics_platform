import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import styles from './DashboardPage.module.css';
import AnalysisWizard from './AnalysisWizard';
import AnalysisDetailPage from './AnalysisDetailPage';
import ComparisonPage from './ComparisonPage'; // Import Comparison Page
import Footer from '../components/Footer';

interface DashboardPageProps {
  profile: any;
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ profile, onLogout }) => {
  const { session } = useAuth();
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false); // Comparison state

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [isDropdownOpen]);

  const fetchDashboardData = async () => {
    if (!session?.user) return;
    setLoading(true);
    // ... (기존 Fetch 로직 유지)

    try {
      // Fetch latest analysis with counterpart info
      const { data: latest, error: latestError } = await supabase
        .from('analyses')
        .select(`
          *,
          counterparts (nickname)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (latestError && latestError.code !== 'PGRST116') {
        console.error('Error fetching latest analysis:', latestError);
      } else {
        setLatestAnalysis(latest);
      }

      // Fetch history (top 10)
      const { data: list, error: listError } = await supabase
        .from('analyses')
        .select(`
          *,
          counterparts (nickname)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (listError) {
        console.error('Error fetching history:', listError);
      } else {
        setHistory(list || []);
      }
    } catch (err) {
      console.error('Unexpected error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  if (showWizard) {
    return (
      <AnalysisWizard 
        onComplete={() => {
          setShowWizard(false);
          fetchDashboardData();
        }}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  if (selectedAnalysisId) {
    return (
      <AnalysisDetailPage 
        analysisId={selectedAnalysisId}
        onBack={() => setSelectedAnalysisId(null)}
      />
    );
  }

  if (showComparison) {
    return (
      <ComparisonPage 
        onBack={() => setShowComparison(false)}
      />
    );
  }

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>대시보드 데이터를 불러오는 중...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className={styles.dashboard} style={{ flex: 1 }}>
        {/* 섹션 A: 헤더 */}
        <header className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>안녕하세요, {profile?.nickname || session?.user.email}님!</h1>
              <p>최근 분석 결과를 기반으로 관계 변화를 확인하세요.</p>
            </div>
            
            {/* 프로필 드롭다운 */}
            <div className={styles.profileContainer} onClick={(e) => e.stopPropagation()}>
              <div 
                className={styles.avatar} 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {profile?.nickname ? profile.nickname.substring(0, 1).toUpperCase() : 'U'}
              </div>
              
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button className={styles.menuItem} onClick={() => alert('마이페이지 - 구현 준비 중')}>마이페이지</button>
                  <div className={styles.menuDivider}></div>
                  <button className={`${styles.menuItem} ${styles.logoutItem}`} onClick={handleLogoutClick}>로그아웃</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ... (기존 섹션 B, C, D 생략되지 않도록 전체 유지) ... */}
        <section className={styles.recentAnalysis}>
          {latestAnalysis ? (
            <div className={styles.recentCard}>
              <div className={styles.cardHeader}>
                <div className={styles.scoreInfo}>
                  <h3>최근 분석 결과 ({latestAnalysis.counterparts?.nickname})</h3>
                  <div className={styles.scoreValue}>{latestAnalysis.score_total}점</div>
                  <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{latestAnalysis.stage} 단계</div>
                </div>
                <div style={{ opacity: 0.8 }}>{new Date(latestAnalysis.created_at).toLocaleDateString()}</div>
              </div>
              <p className={styles.summary}>"{latestAnalysis.summary_public}"</p>
                          <div className={styles.cardButtons}>
                            <button className={styles.primaryBtn} onClick={() => setSelectedAnalysisId(latestAnalysis.id)}>리포트 보기</button>
                            <button className={styles.secondaryBtn} onClick={() => setShowWizard(true)}>다시 분석하기</button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.recentCard} style={{ textAlign: 'center', background: '#f5f5f5', color: '#666', boxShadow: 'none' }}>
                          <p>아직 분석 결과가 없습니다. 첫 분석을 시작해보세요!</p>
                          <button className={styles.primaryBtn} style={{ marginTop: '15px', color: '#8a2be2' }} onClick={() => setShowWizard(true)}>새 분석 시작하기</button>
                        </div>
                      )}
                    </section>
              
                    <section className={styles.quickActions}>
                              <div className={styles.actionCard} onClick={() => setShowWizard(true)}>
                                <h3>새 분석 시작</h3>
                                <p style={{ fontSize: '0.9em', color: '#777' }}>대화 이미지를 업로드하세요</p>
                              </div>
                              <div className={styles.actionCard} onClick={() => setShowComparison(true)}>
                                <h3>이전 분석 비교</h3>
                                <p style={{ fontSize: '0.9em', color: '#777' }}>관계가 어떻게 변했나요?</p>
                              </div>
                              <div className={styles.actionCard} onClick={() => alert('플랜')}>
                      
                        {profile?.is_subscribed ? (
                          <span className={styles.proBadge}>PRO 활성</span>
                        ) : (
                          <>
                            <h3>유료 기능 보기</h3>
                            <p style={{ fontSize: '0.9em', color: '#777' }}>전문적인 분석 언락</p>
                          </>
                        )}
                      </div>
                    </section>
              
                    <section className={styles.historySection}>
                      <h2>최근 분석 리스트</h2>
                      <div className={styles.historyList}>
                        <div className={`${styles.historyRow} ${styles.historyHeader}`}>
                          <div>상대방</div>
                          <div>날짜</div>
                          <div>점수</div>
                          <div>단계</div>
                          <div>언락 여부</div>
                        </div>
                        {history.length > 0 ? (
                          history.map((item) => (
                            <div key={item.id} className={styles.historyRow} onClick={() => setSelectedAnalysisId(item.id)}>
                              <div style={{ fontWeight: '600' }}>{item.counterparts?.nickname}</div>
                              <div style={{ color: '#777', fontSize: '0.9em' }}>{new Date(item.created_at).toLocaleDateString()}</div>
                              <div style={{ color: '#8a2be2', fontWeight: 'bold' }}>{item.score_total}</div>
                              <div>{item.stage}</div>
                              <div>{item.is_unlocked ? '✅' : '🔒'}</div>
                            </div>
                          ))
              
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: '#999' }}>히스토리가 없습니다.</div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
