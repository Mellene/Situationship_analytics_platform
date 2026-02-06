import React from 'react';
import styles from './LandingPage.module.css';
import NumberAnimation from '../components/NumberAnimation';
import ReviewCarousel from '../components/ReviewCarousel';

const LandingPage: React.FC = () => {
  const reviews = [
    { id: 1, content: "썸 때문에 밤새 고민했는데, 이젠 확신이 들어요!", author: "김*원" },
    { id: 2, content: "분석 결과가 너무 정확해서 소름 돋았어요. 덕분에 좋은 인연 만났습니다!", author: "이*정" },
    { id: 3, content: "애매했던 관계에 명확한 답을 얻었어요. 정말 유용합니다!", author: "박*호" },
    { id: 4, content: "썸 전문가가 된 기분이에요. 주변 친구들에게도 추천하고 있어요!", author: "최*영" },
    { id: 5, content: "간단한 질문 몇 개로 이렇게 깊이 있는 분석이라니 놀랍네요.", author: "정*민" },
  ];

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
          <p className={styles.trustValue}><NumberAnimation targetValue={95} suffix="%" /></p>
          <p className={styles.trustLabel}>분석 정확도</p>
        </div>
        <div className={styles.trustItem}>
          <p className={styles.trustValue}><NumberAnimation targetValue={10000} suffix="+" /></p>
          <p className={styles.trustLabel}>사용자</p>
        </div>
        <div className={styles.trustItem}>
          <ReviewCarousel reviews={reviews} />
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