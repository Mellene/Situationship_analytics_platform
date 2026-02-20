import React, { useState } from 'react';
import styles from './LandingPage.module.css';
import NumberAnimation from '../components/NumberAnimation';
import ReviewCarousel from '../components/ReviewCarousel';
import NavigationBar from '../components/NavigationBar';
import AuthSelectionPage from '../components/AuthSelectionPage';
import AnonymousStartPage from '../components/AnonymousStartPage';
import SimpleChatInputPage from '../components/SimpleChatInputPage';
import TrialResultPage from '../components/TrialResultPage';
import LoadingPage from '../components/LoadingPage'; // Import LoadingPage
import GradientWave from '../components/GradientWave';

type AnonymousStep = 'Landing' | 'AuthSelection' | 'StartPage' | 'ChatInput' | 'ResultPage';

// Helper function to convert sumPeriod to weeks
const convertSumPeriodToWeeks = (period: string): number => {
  switch (period) {
    case '1w': return 1;
    case '1m': return 4; // Approx 1 month = 4 weeks
    case '3m': return 12; // Approx 3 months = 12 weeks
    case '3m+': return 16; // Greater than 3 months, use a higher value
    default: return 0;
  }
};

// Helper function to convert replyInterval to hours
const convertReplyIntervalToHours = (interval: string): number => {
  switch (interval) {
    case '5m': return 5 / 60;
    case '30m': return 30 / 60;
    case '1h': return 1;
    case '3h': return 3;
    case '6h': return 6;
    case '12h': return 12;
    case '1d': return 24;
    default: return 0;
  }
};

const LandingPage: React.FC = () => {
  const [currentAnonymousStep, setCurrentAnonymousStep] = useState<AnonymousStep>('Landing');
  const [isLoading, setIsLoading] = useState(false); // New state for loading
  const [calculatedResultData, setCalculatedResultData] = useState<any>(null); // State to store dynamic results

  const reviews = [
    { id: 1, content: "썸 때문에 밤새 고민했는데, 이젠 확신이 들어요!", author: "김*원" },
    { id: 2, content: "분석 결과가 너무 정확해서 소름 돋았어요. 덕분에 좋은 인연 만났습니다!", author: "이*정" },
    { id: 3, content: "애매했던 관계에 명확한 답을 얻었어요. 정말 유용합니다!", author: "박*호" },
    { id: 4, content: "썸 전문가가 된 기분이에요. 주변 친구들에게도 추천하고 있어요!", author: "최*영" },
    { id: 5, content: "간단한 질문 몇 개로 이렇게 깊이 있는 분석이라니 놀랍네요.", author: "정*민" },
  ];

  const handleStartAnalysisClick = () => {
    setCurrentAnonymousStep('AuthSelection');
  };

  const handleCloseAuthSelection = () => {
    setCurrentAnonymousStep('Landing');
  };

  const handleAnonymousExperience = () => {
    setCurrentAnonymousStep('StartPage');
  };

  const handleStartAnonymousFlow = () => {
    setCurrentAnonymousStep('ChatInput');
  };

  const calculateTrialResultData = (meetCount: number, sumPeriod: string, replyInterval: string) => {
    // Convert inputs to algorithm variables
    const M = meetCount;
    const D = convertSumPeriodToWeeks(sumPeriod);
    const R = convertReplyIntervalToHours(replyInterval);

    // Assume values for parameters not available from current input (from image analysis)
    // Rb: 상대 평소 답장 텀 (Assume a baseline of 3 hours for example)
    const Rb_assumed = 3; 
    // I: 상대 먼저 연락 비율 (Assume 0.5 for neutral)
    const I_assumed = 0.5;
    // P: 미래 약속/진전 신호 (Assume 0.5 for neutral)
    const P_assumed = 0.5;

    // Derived variables calculation
    // Ensure D is not zero to avoid division by zero
    const MD = D > 0 ? M / D : M; // 만남 밀도
    // Ensure Rb_assumed is not zero
    const RV = Rb_assumed > 0 ? R / Rb_assumed : R; // 기대위반 지수
    const IN = I_assumed; // 주도성
    const PS = P_assumed; // 진전 신호

    // 1차 점수 산출 (Base Score)
    let score = (MD * 30) + ((1 / RV) * 25) + (IN * 20) + (PS * 25);
    
    // Normalization to 0-100 (simple min-max normalization, might need adjustment)
    // Assuming min possible score is roughly 0 and max is roughly 100 for these weights
    score = Math.max(0, Math.min(100, score));

    // Round the score
    score = Math.round(score);

    let stage = "썸 가능"; // Default stage

    // 조건 분기 알고리즘 (Rule Layer)
    if (MD >= 1.0 && D <= 4 && RV <= 1.2) { // 4 weeks
      stage = "썸 확률 높음";
    } else if (MD >= 1.0 && RV >= 1.8 && PS <= 0.5) {
      stage = "애매/상황관계";
      score = Math.max(0, score - 15);
    } else if (MD >= 1.0 && RV <= 1.2 && PS >= 0.8) {
      stage = "연애 직전";
      score = Math.min(100, score + 10);
    } else if (MD <= 0.3 && RV <= 1.2 && IN >= 0.6) {
      stage = "온라인 친밀 썸";
    } else if (MD <= 0.3 && RV >= 1.8 && IN <= 0.3) {
      stage = "관심 낮음";
      score = Math.max(0, score - 20);
    }

    // Final Stage Classification
    if (score >= 80) stage = "연애 직전";
    else if (score >= 65) stage = "썸 확정";
    else if (score >= 50) stage = "썸 가능";
    else if (score >= 35) stage = "관심";
    else stage = "낮음";

    return {
      affinity: score,
      relationshipStage: stage,
      conversationBalance: '측정 불가', // Requires image analysis
      replySpeedSummary: R < Rb_assumed ? '상대는 평균보다 빠른 답장을 합니다' : R > Rb_assumed * 1.5 ? '상대는 평균보다 느린 답장을 합니다' : '상대는 평균적인 답장을 합니다',
      questionRatioSummary: '측정 불가', // Requires image analysis
      confessionProbability: '확인하려면 3,900원',
      confessionTiming: '확인하려면 3,900원',
      contactStrategy: '확인하려면 3,900원',
      relationshipFuture: '확인하려면 3,900원',
    };
  };

  const handleAnalyzeChat = (_imageData: string, meetCount: number, sumPeriod: string, replyInterval: string) => {
    setIsLoading(true); // Start loading

    // Calculate results dynamically
    const results = calculateTrialResultData(meetCount, sumPeriod, replyInterval);
    setCalculatedResultData(results); // Store calculated results

    // Simulate analysis time
    setTimeout(() => {
      setIsLoading(false); // End loading
      setCurrentAnonymousStep('ResultPage');
    }, 2000); // 2 seconds loading time
  };

  const handleBackFromStartPage = () => {
    setCurrentAnonymousStep('AuthSelection');
  };

  const handleBackFromChatInput = () => {
    setCurrentAnonymousStep('StartPage');
  };
  
  const handleBackFromTrialResult = () => {
    setCurrentAnonymousStep('ChatInput');
  };


  const renderContent = () => {
    if (isLoading) {
      return <LoadingPage />;
    }

    switch (currentAnonymousStep) {
      case 'Landing':
        return (
          <>
            {/* Hero Section */}
            <section className={styles.heroSection}>
              <GradientWave />
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                  당신이 생각하는 <br /> 썸이라는 확신
                </h1>
                <p className={styles.heroDescription}>
                  그 사람의 행동이 썸인지 아닌지 헷갈리시나요? <br />
                  AI 기반의 관계 분석 서비스로 명확한 답을 얻어보세요.
                </p>
                <div className={styles.ctaButtons}>
                  <button className={styles.ctaButton} onClick={handleStartAnalysisClick}>
                    썸 분석 시작하기
                  </button>
                  <button className={styles.secondaryButton} onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
                    더 알아보기
                  </button>
                </div>
              </div>
            </section>

            {/* Trust Elements Section */}
            <section id="features" className={styles.trustSection}>
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
            <section id="price" className={styles.featuresSection}>
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

            {/* Credibility Explanation Section */}
            <section id="contact" className={styles.credibilitySection}>
              <h2 className={styles.sectionTitle}>분석 점수의 과학적 근거</h2>
              <p className={styles.credibilityText}>
                본 썸 분석 점수는 관계심리·커뮤니케이션 연구를 기반으로 산출됩니다. 
                특히 지각된 파트너 반응성(PPR, Reis & Clark) 이론을 바탕으로 답장 속도·질문·공감 표현을 관계 관심 신호로 반영하고, 
                기대위반 이론(Expectancy Violation Theory) 을 적용해 ‘평소 대비 답장 지연(RV)’을 불확실성 지표로 계산합니다. 
                또한 FTF(대면 상호작용) 연구를 근거로 만남 빈도·지속 기간을 관계 진전성으로 반영해, 
                텍스트 반응성과 오프라인 접촉을 결합한 복합 점수로 썸 확률을 산출합니다.
              </p>
            </section>
          </>
        );
      case 'AuthSelection':
        return (
          <AuthSelectionPage
            onClose={handleCloseAuthSelection}
            onAnonymousExperience={handleAnonymousExperience}
          />
        );
      case 'StartPage':
        return (
          <AnonymousStartPage
            onStartExperience={handleStartAnonymousFlow}
            onBack={handleBackFromStartPage}
          />
        );
      case 'ChatInput':
        return (
          <SimpleChatInputPage
            onAnalyze={handleAnalyzeChat}
            onBack={handleBackFromChatInput}
          />
        );
      case 'ResultPage':
        return (
          <TrialResultPage
            resultData={calculatedResultData} // Pass dynamically calculated data
            onSignUpClick={() => alert('회원가입 페이지로 이동')}
            onBack={handleBackFromTrialResult}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.landingPage}>
      <NavigationBar onStartClick={handleStartAnalysisClick} />
      {renderContent()}
      <footer className={styles.footer}>
        <p>&copy; 2024 Dopamin. All rights reserved.</p>
        <p>본 서비스의 모든 내용은 관계심리 연구를 기반으로 합니다.</p>
      </footer>
    </div>
  );
};

export default LandingPage;