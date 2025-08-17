import React, { JSX } from 'react';
import Link from 'next/link';
import styles from './NotFound.module.css';

function NotFoundStatic(): JSX.Element {
  return (
    <div className={styles.container}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <div className={styles.homeOnly}>
        <Link href="/en" className={styles.homeLink}>
          🏠 Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundStatic;
