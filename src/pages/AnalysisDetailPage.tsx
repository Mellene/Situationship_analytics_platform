import React, { useEffect, useState } from 'react';
import styles from './AnalysisDetailPage.module.css';
import { supabase } from '../supabaseClient';
import NumberAnimation from '../components/NumberAnimation';

interface AnalysisDetailPageProps {
  analysisId: string;
  onBack: () => void;
}

const AnalysisDetailPage: React.FC<AnalysisDetailPageProps> = ({ analysisId, onBack }) => {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isShaking, setIsShaking] = useState(false);
  const [isCtaHighlighted, setIsCtaHighlighted] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);

  useEffect(() => {
    fetchAnalysisDetail();
  }, [analysisId]);

  const fetchAnalysisDetail = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select(`*, counterparts(nickname)`)
        .eq('id', analysisId)
        .single();

      if (error) throw error;
      setAnalysis(data);
    } catch (err) {
      console.error('Error fetching analysis:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLockClick = () => {
    setIsShaking(true);
    setIsCtaHighlighted(true);
    setTimeout(() => setIsShaking(false), 500);
    setTimeout(() => setIsCtaHighlighted(false), 2000);
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>리포트를 생성 중입니다...</div>;
  if (!analysis) return <div>리포트를 찾을 수 없습니다.</div>;

  return (
    <div className={styles.container}>
      <button onClick={onBack} style={{position: 'absolute', top: 20, left: 20, border: 'none', background: 'none', fontSize: '1.2em', cursor: 'pointer'}}>←</button>

      {/* A. Hero Section */}
      <section className={styles.hero}>
        <div className={styles.gaugeContainer}>
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#eee" strokeWidth="15" />
            <circle 
              cx="100" cy="100" r="90" fill="none" stroke="#ff69b4" strokeWidth="15" 
              strokeDasharray="565" 
              strokeDashoffset={565 - (565 * analysis.score_total) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 2s ease-out' }}
            />
          </svg>
          <div className={styles.scoreText}>
            <span className={styles.scoreNumber}>
              <NumberAnimation targetValue={analysis.score_total} />%
            </span>
            <span className={styles.scoreLabel}>{analysis.stage}</span>
          </div>
        </div>
        <h1 className={styles.heroTitle}>{analysis.counterparts?.nickname}님과 당신의 썸 확률</h1>
        <p className={styles.heroSubtitle}>
          "{analysis.summary_public}" <br/>
          <span className={styles.highlight}>조금만 더 노력하면 특별한 관계로 발전할 수 있어요!</span>
        </p>
      </section>

      {/* B. Free Summary Card */}
      <section className={styles.summarySection}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>💬 긍정적인 신호</div>
          <p>상대방이 {analysis.contact_frequency === '칼답/실시간' ? '매우 빠른 답장을 보내며' : '비교적 꾸준히 대화를 이어가며'} 당신에게 집중하고 있습니다.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>🔥 주의 깊게 볼 점</div>
          <p>두 사람의 만남 형태가 {analysis.meeting_type === '항상 1:1로 만남' ? '안정적이지만' : '주로 여럿이 섞여 있어'} 더 깊은 대화가 필요해 보입니다.</p>
        </div>
      </section>

      {/* C & D. Paywall Divider & Skeleton */}
      <div className={styles.paywallWrapper}>
        <div className={styles.paywallOverlay}>
          <div 
            className={`${styles.lockIcon} ${isShaking ? styles.shake : ''}`}
            onClick={handleLockClick}
          >
            🔒
          </div>
          <p className={styles.paywallText}>상대방의 진짜 속마음이 궁금하신가요?</p>
          <p style={{color: '#666', fontSize: '0.9em'}}>분석 결과의 80%가 숨겨져 있습니다.</p>
        </div>

        <div className={styles.blurredArea}>
          <h3 style={{marginBottom: '15px'}}>🔒 상대방이 나를 헷갈리게 하는 진짜 심리</h3>
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonLine} style={{width: '80%'}}></div>
            <div className={styles.skeletonLine} style={{width: '60%'}}></div>
            <div className={styles.skeletonLine} style={{width: '90%'}}></div>
          </div>
          <h3 style={{marginBottom: '15px'}}>🔒 연락 텀으로 분석한 '나의 우선순위'</h3>
          <div className={styles.skeletonCard}>
            <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end', height: '100px'}}>
              <div style={{flex: 1, background: '#eee', height: '40%'}}></div>
              <div style={{flex: 1, background: '#ff69b4', height: '80%'}}></div>
              <div style={{flex: 1, background: '#eee', height: '60%'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* E. Floating CTA */}
      <button 
        className={`${styles.floatingCta} ${isCtaHighlighted ? styles.highlight : ''}`}
        onClick={() => setShowPaymentSheet(true)}
      >
        커피 한 잔 값으로 전체 결과 열람하기 (₩1,900)
      </button>

      {/* Payment Bottom Sheet */}
      <div className={`${styles.overlay} ${showPaymentSheet ? styles.open : ''}`} onClick={() => setShowPaymentSheet(false)}></div>
      <div className={`${styles.bottomSheet} ${showPaymentSheet ? styles.open : ''}`}>
        <h2 style={{textAlign: 'center', marginBottom: '20px'}}>리포트 언락하기</h2>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '30px'}}>
          결제 즉시 모든 분석 결과가 공개되며,<br/>
          상대방 공략을 위한 맞춤 가이드가 제공됩니다.
        </p>
        <button 
          className={styles.floatingCta} 
          style={{position: 'static', transform: 'none', width: '100%'}}
          onClick={() => alert('결제 연동이 필요합니다.')}
        >
          1,900원 결제하고 바로보기
        </button>
      </div>
    </div>
  );
};

export default AnalysisDetailPage;
