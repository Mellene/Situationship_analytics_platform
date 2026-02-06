import React from 'react';
import styles from './LandingPage.module.css';

const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>지금 썸, <span className={styles.highlight}>확신</span> 있나요?</h1>
        <button className={styles.ctaButton}>썸 분석 시작하기</button>
      </section>

      {/* Trust Elements Section */}
      <section className={styles.trustSection}>
        <div className={styles.trustItem}>
          <p className={styles.trustValue}>95%</p>
          <p className={styles.trustLabel}>분석 정확도</p>
        </div>
        <div className={styles.trustItem}>
          <p className={styles.trustValue}>10,000+</p>
          <p className={styles.trustLabel}>사용자</p>
        </div>
        <div className={styles.trustItem}>
          <p className={styles.trustValue}>"썸 때문에 밤새 고민했는데, 이젠 확신이 들어요!"</p>
          <p className={styles.trustLabel}>- 사용자 후기</p>
        </div>
      </section>

      {/* Feature Introduction Cards */}
      <section className={styles.featuresSection}>
        <h2 className={styles.sectionTitle}>핵심 기능</h2>
        <div className={styles.featureCards}>
          <div className={styles.featureCard}>
            <h3>호감도 분석</h3>
            <p>상대방의 <span className={styles.highlight}>관심</span>을 수치화하여 객관적으로 파악하세요.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>답장 패턴</h3>
            <p>연락 <span className={styles.highlight}>속도</span>와 빈도로 상대의 <span className={styles.highlight}>몰입도</span>를 분석합니다.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>고백 타이밍</h3>
            <p>AI가 분석한 데이터로 <span className={styles.highlight}>최적의 순간</span>을 예측해 성공률을 높여보세요.</p>
          </div>
        </div>
      </section>

      {/* Anxiety to Solution Message (implicit in overall design and copy) */}
    </div>
  );
};

export default LandingPage;