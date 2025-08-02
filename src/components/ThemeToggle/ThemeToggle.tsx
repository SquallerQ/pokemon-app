import React, { JSX } from 'react';
import { useTheme } from '../ThemeContext/ThemeContext';
import styles from './ThemeToggle.module.css';

function ThemeToggle(): JSX.Element {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      <span className={styles.slider}></span>
    </label>
  );
}

export default ThemeToggle;
