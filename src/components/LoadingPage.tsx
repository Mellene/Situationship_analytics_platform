import React from 'react';
import styles from './LoadingPage.module.css';

const LoadingPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>분석 중...</p>
      <p className={styles.subMessage}>잠시만 기다려 주세요.</p>
    </div>
  );
};

export default LoadingPage;
