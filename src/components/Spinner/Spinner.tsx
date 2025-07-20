import React, { Component, JSX } from 'react';
import styles from './Spinner.module.css';

class Spinner extends Component {
  render(): JSX.Element {
    return (
      <div className={styles.spinnerContainer} role="status">
        <div className={styles.spinner}></div>
      </div>
    );
  }
}

export default Spinner;
