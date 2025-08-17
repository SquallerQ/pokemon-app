'use client';

import React, { JSX } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '../../i18n/navigation';
import styles from './About.module.css';

function About(): JSX.Element {
  const t = useTranslations('About');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('title')}</h1>
      <p className={styles.text}>
        {t('author')}{' '}
        <Link
          href="https://github.com/SquallerQ"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          Squaller
        </Link>
      </p>
      <p className={styles.text}>
        <Link
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {t('course')}
        </Link>
      </p>
    </div>
  );
}

export default About;
