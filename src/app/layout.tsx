'use client';

import type { ReactNode } from 'react';
import '../index.css';
// import '../App.module.css';
import { ThemeProvider } from '../components/ThemeContext/ThemeContext';

import Nav from '../components/Nav/Nav';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
