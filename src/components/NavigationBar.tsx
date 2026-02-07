import React from 'react';
import styles from './NavigationBar.module.css';

const NavigationBar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>Dopamin</div>
      <ul className={styles.navbarNav}>
      </ul>
    </nav>
  );
};

export default NavigationBar;
