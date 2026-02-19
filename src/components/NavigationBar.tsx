import React from 'react';
import styles from './NavigationBar.module.css';

const NavigationBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>썸연구소</div>
      <ul className={styles.navbarNav}>
      </ul>
    </nav>
  );
};

export default NavigationBar;
