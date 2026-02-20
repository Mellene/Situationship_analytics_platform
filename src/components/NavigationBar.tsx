import React from 'react';
import styles from './NavigationBar.module.css';

interface NavigationBarProps {
  onStartClick?: () => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onStartClick }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>썸연구소</div>
      
      <div className={styles.navbarCenter}>
        <button className={styles.navLink} onClick={() => scrollToSection('features')}>Features</button>
        <button className={styles.navLink} onClick={() => scrollToSection('price')}>Price</button>
        <button className={styles.navLink} onClick={() => scrollToSection('contact')}>Contact</button>
      </div>

      <div className={styles.navbarRight}>
        <button className={styles.getStartedBtn} onClick={onStartClick}>
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default NavigationBar;
