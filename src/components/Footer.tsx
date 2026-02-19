import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} <strong>Dopamin</strong>. All rights reserved.
        </p>
        <p className={styles.info}>
          본 서비스의 모든 분석 결과는 관계심리 및 커뮤니케이션 연구 데이터를 기반으로 산출됩니다.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
