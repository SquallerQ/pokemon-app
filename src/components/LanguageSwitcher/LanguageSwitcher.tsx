'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return;

    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;

    router.push(newPath);
  };

  return (
    <div>
      <button
        onClick={() => switchLocale('en')}
        disabled={currentLocale === 'en'}
        className={currentLocale === 'en' ? 'active' : ''}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('ru')}
        disabled={currentLocale === 'ru'}
        className={currentLocale === 'ru' ? 'active' : ''}
      >
        RU
      </button>
    </div>
  );
}
