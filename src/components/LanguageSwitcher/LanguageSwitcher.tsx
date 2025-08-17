'use client';

import { useRouter, usePathname } from '../../i18n/navigation';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    const params = searchParams.toString();
    const query = params ? `?${params}` : '';

    router.push(`${pathname}${query}`, { locale: newLocale });
  };

  return (
    <div className={styles.languageSwitcher}>
      <button
        onClick={() => switchLocale('en')}
        disabled={currentLocale === 'en'}
        className={`${styles.button} ${currentLocale === 'en' ? styles.active : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('ru')}
        disabled={currentLocale === 'ru'}
        className={`${styles.button} ${currentLocale === 'ru' ? styles.active : ''}`}
      >
        RU
      </button>
    </div>
  );
}
