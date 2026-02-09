import GoogleIcon from '../assets/google-icon.svg';
import styles from './AuthSelectionPage.module.css';
import { supabase } from '../supabaseClient'; // Import supabase client

interface AuthSelectionPageProps {
  onClose: () => void;
  onAnonymousExperience: () => void;
}

const AuthSelectionPage: React.FC<AuthSelectionPageProps> = ({
  onClose,
  onAnonymousExperience,
}) => {
  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // Redirect back to the app's origin
        },
      });

      if (error) {
        console.error('Error during Google login:', error);
        alert('Google 로그인 중 오류가 발생했습니다: ' + error.message);
      } else {
        // Optionally, you can close the modal or perform other actions
        // if the redirection doesn't automatically close it or handle the state.
        console.log('Google login initiated:', data);
      }
    } catch (err) {
      console.error('Unexpected error during Google login:', err);
      alert('예상치 못한 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2 className={styles.title}>썸 분석 시작하기</h2>
        <p className={styles.description}>어떤 방식으로 시작하시겠어요?</p>

        <div className={styles.authOptions}>
          <button className={styles.authButton} onClick={handleGoogleLogin}>
            <img src={GoogleIcon} alt="Google" className={styles.authIcon} />
            Google 로그인
          </button>
          <button className={styles.authButton} onClick={onAnonymousExperience}>
            익명 체험
          </button>
        </div>

        <p className={styles.privacyMessage}>대화 데이터는 암호화됩니다</p>
        <p className={styles.termsAndPrivacy}>
          By continuing, you agree to our <a href="#" target="_blank" rel="noopener noreferrer">Terms of Use</a> and <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default AuthSelectionPage;
