import React from 'react';
import styles from './NavigationBar.module.css';

interface NavigationBarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <nav className={`${styles.navbar} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.navbarBrand}>Dopamin</div>
      <ul className={styles.navbarNav}>
      </ul>
    </nav>
  );
};

export default NavigationBar;
