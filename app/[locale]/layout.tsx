import '../../src/index.css';
import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import LayoutContent from './LayoutContent';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout(props: LocaleLayoutProps) {
  const { children } = props;
  const params = await props.params;
  const locale = params.locale;

  const supportedLocales = ['en', 'ru'];
  if (!supportedLocales.includes(locale)) {
    return notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LayoutContent showNav={true}>{children}</LayoutContent>
    </NextIntlClientProvider>
  );
}
