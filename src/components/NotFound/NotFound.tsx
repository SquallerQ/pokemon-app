'use client';

import React, { JSX } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './NotFound.module.css';

function NotFound(): JSX.Element {
  const t = useTranslations('NotFound');

  return (
    <div className={styles.container}>
      <h1>{t('title')}</h1>
      <p>{t('message')}</p>
      <Link href="/">{t('homeLink')}</Link>
    </div>
  );
}

export default NotFound;
