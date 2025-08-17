'use client';

import { ReactNode } from 'react';
import Nav from '../../src/components/Nav/Nav';
import { ThemeProvider } from '../../src/components/ThemeContext/ThemeContext';
import LanguageSwitcher from '../../src/components/LanguageSwitcher/LanguageSwitcher';

export default function LayoutContent({
  children,
  showNav = true,
}: {
  children: ReactNode;
  showNav?: boolean;
}) {
  return (
    <ThemeProvider>
      {showNav && (
        <>
          <Nav />
          <LanguageSwitcher />
        </>
      )}
      {children}
    </ThemeProvider>
  );
}
