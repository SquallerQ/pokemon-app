'use client';

import React from 'react';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { Link } from '../../i18n/navigation';
import { useTranslations } from 'next-intl';
import styles from './Nav.module.css';

export default function Nav() {
  const t = useTranslations('Nav');

  return (
    <nav className={styles.nav}>
      <Link href="/">{t('home')}</Link>
      <ThemeToggle />
      <Link href="/about">{t('about')}</Link>
    </nav>
  );
}
