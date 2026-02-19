import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import styles from './ProfileCreatePage.module.css';

interface ProfileCreatePageProps {
  onProfileCreated: () => void;
}

const ProfileCreatePage: React.FC<ProfileCreatePageProps> = ({ onProfileCreated }) => {
  const { session } = useAuth();
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    if (!nickname || !age) {
      alert('모든 필드를 입력해주세요!');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('profiles').insert([
        {
          id: session.user.id,
          nickname,
          gender,
          age: parseInt(age),
        },
      ]);

      if (error) {
        console.error('Error creating profile:', error);
        alert('프로필 생성 중 오류가 발생했습니다: ' + error.message);
      } else {
        onProfileCreated();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('예상치 못한 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>거의 다 왔어요!</h1>
      <p className={styles.description}>당신에 대해 조금 더 알려주세요.</p>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>닉네임</label>
          <input
            type="text"
            className={styles.input}
            placeholder="사용하실 닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>성별</label>
          <select
            className={styles.select}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">남성</option>
            <option value="female">여성</option>
            <option value="other">기타</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label>나이</label>
          <input
            type="number"
            className={styles.input}
            placeholder="나이를 숫자로 입력하세요"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리 중...' : '시작하기'}
        </button>
      </form>
    </div>
  );
};

export default ProfileCreatePage;
