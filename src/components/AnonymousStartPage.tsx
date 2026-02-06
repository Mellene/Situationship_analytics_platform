import React from 'react';
import styles from './AnonymousStartPage.module.css';

interface AnonymousStartPageProps {
  onStartExperience: () => void;
  onBack: () => void; // Added for navigation back
}

const AnonymousStartPage: React.FC<AnonymousStartPageProps> = ({ onStartExperience, onBack }) => {
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>← 뒤로</button>
      <h2 className={styles.title}>로그인 없이 썸 분석 체험하기</h2>
      <p className={styles.subtitle}>대화 내용 일부만 입력해도 분석됩니다</p>

      <button className={styles.ctaButton} onClick={onStartExperience}>익명 체험 시작</button>

      <div className={styles.trustElements}>
        <p className={styles.emphasis}>⚠️ 기록되지 않습니다</p>
        <p>데이터 저장 안함 안내</p>
        <p>자동 삭제 안내 (24시간 후)</p>
        {/* Placeholder for a security icon */}
        <span className={styles.securityIcon}>🔒</span>
      </div>
    </div>
  );
};

export default AnonymousStartPage;
