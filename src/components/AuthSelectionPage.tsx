import React from 'react';
import styles from './AuthSelectionPage.module.css';

interface AuthSelectionPageProps {
  onClose: () => void;
  // onGoogleLogin: () => void; // Future: Implement actual login logic
  // onAppleLogin: () => void;   // Future: Implement actual login logic
  onAnonymousExperience: () => void;
}

const AuthSelectionPage: React.FC<AuthSelectionPageProps> = ({
  onClose,
  // onGoogleLogin,
  // onAppleLogin,
  onAnonymousExperience,
}) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2 className={styles.title}>썸 분석 시작하기</h2>
        <p className={styles.description}>어떤 방식으로 시작하시겠어요?</p>

        <div className={styles.authOptions}>
          <button className={styles.authButton} onClick={() => alert('Google 로그인 (준비 중)')}>
            <img src="/path/to/google-icon.svg" alt="Google" className={styles.authIcon} />
            Google 로그인
          </button>
          <button className={styles.authButton} onClick={onAnonymousExperience}>
            익명 체험
          </button>
        </div>

        <p className={styles.privacyMessage}>대화 데이터는 암호화됩니다</p>
      </div>
    </div>
  );
};

export default AuthSelectionPage;
