import React from 'react';
import styles from './TrialResultPage.module.css';
import NumberAnimation from './NumberAnimation'; // Assuming NumberAnimation is in the same components folder

interface TrialResultPageProps {
  resultData: {
    // Level 1: Core Results (Always visible)
    affinity: number; // 종합 호감도 %
    relationshipStage: string; // 관계 단계
    conversationBalance: string; // 대화 밸런스 (e.g., "60 : 40")

    // Level 2: Partial Analysis (Summary, details blurred)
    replySpeedSummary: string; // 답장 속도 분석 요약
    questionRatioSummary: string; // 질문 비율 요약

    // Level 3: Locked Core Insights (Hidden, requires signup)
    confessionProbability: string; // 고백 성공 확률
    confessionTiming: string; // 고백 추천 시기
    contactStrategy: string; // 연락 전략
    relationshipFuture: string; // 관계 미래 예측
  };
  onSignUpClick: () => void;
  onBack: () => void;
}

const TrialResultPage: React.FC<TrialResultPageProps> = ({ resultData, onSignUpClick, onBack }) => {
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>← 뒤로</button>
      <h2 className={styles.title}>체험 결과</h2>
      <p className={styles.description}>당신 썸의 미래를 확인하세요</p>

      <div className={styles.resultSection}>
        {/* Level 1 — 핵심 결과 공개 (신뢰 확보) */}
        <div className={styles.publicResult}>
          <div className={styles.resultItem}>
            <p className={styles.label}>종합 호감도</p>
            <p className={styles.value}><NumberAnimation targetValue={resultData.affinity} suffix="%" /></p>
          </div>
          <div className={styles.resultItem}>
            <p className={styles.label}>관계 단계</p>
            <p className={styles.value}>{resultData.relationshipStage}</p>
          </div>
          <div className={styles.resultItem}>
            <p className={styles.label}>대화 밸런스</p>
            <p className={styles.value}>{resultData.conversationBalance}</p>
          </div>
        </div>

        <div className={styles.separator}>──────────────</div>

        {/* Level 2 — 일부 분석 공개 (흥미 유도) */}
        <div className={styles.partialResult}>
          <div className={styles.resultSummaryItem}>
            <p className={styles.summaryLabel}>답장 속도 분석</p>
            <p className={styles.summaryValue}>{resultData.replySpeedSummary}</p>
            <p className={styles.blurText}>상세 수치는 🔒 Blur</p>
          </div>
          <div className={styles.resultSummaryItem}>
            <p className={styles.summaryLabel}>질문 비율</p>
            <p className={styles.summaryValue}>{resultData.questionRatioSummary}</p>
            <p className={styles.blurText}>그래프는 🔒 Blur</p>
          </div>
        </div>

        <div className={styles.separator}>──────────────</div>

        {/* Level 3 — 핵심 행동 인사이트 차단 (가입 유도) */}
        <div className={styles.lockedResult}>
          <p className={styles.lockedItem}><span className={styles.lockIcon}>🔒</span> 고백 성공 확률: {resultData.confessionProbability}</p>
          <button className={styles.ctaUnlockBelowBlur} onClick={onSignUpClick}>
            전체 결과 보기 → 3초 가입
          </button>
          <p className={styles.lockedItem}><span className={styles.lockIcon}>🔒</span> 고백 추천 시기: {resultData.confessionTiming}</p>
          <p className={styles.lockedItem}><span className={styles.lockIcon}>🔒</span> 연락 전략: {resultData.contactStrategy}</p>
          <button className={styles.ctaUnlockBelowBlur} onClick={onSignUpClick}>
            연락 전략 확인하기
          </button>
          <p className={styles.lockedItem}><span className={styles.lockIcon}>🔒</span> 관계 미래 예측: {resultData.relationshipFuture}</p>
        </div>

        <button className={styles.unlockButtonBottom} onClick={onSignUpClick}>
          무료 가입 후 전체 리포트 확인
        </button>
        <p className={styles.saveMessage}>결과는 24시간 후 삭제됩니다</p>
        <p className={styles.saveMessage}>리포트 저장하려면 가입</p>
        <p className={styles.saveMessage}>회원은 과거 썸 비교 가능</p>
      </div>

      {/* Algorithm Details Section - Summarized */}
      <div className={styles.algorithmSection}>
        <h3 className={styles.algorithmTitle}>분석 알고리즘</h3>
        <p className={styles.algorithmSummaryText}>
          본 분석 점수는 인공지능 기반의 관계 심리 분석 알고리즘을 통해 산출됩니다.
          사용자의 대화 패턴, 만남 빈도, 썸 기간 등 다양한 데이터를 분석하여 썸의 진행도와 확률을 예측합니다.
        </p>
      </div>
    </div>
  );
};

export default TrialResultPage;