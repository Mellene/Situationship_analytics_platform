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
        <li>
          <button onClick={toggleDarkMode} className={styles.modeToggle}>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
