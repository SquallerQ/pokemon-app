import React, { JSX } from 'react';
import styles from './Spinner.module.css';

function Spinner(): JSX.Element {
  return (
    <div className={styles.spinnerContainer} role="status">
      <div className={styles.spinner}></div>
    </div>
  );
}

export default Spinner;
