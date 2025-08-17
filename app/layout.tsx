import { ReactNode } from 'react';
import '../src/index.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body> {children} </body>
    </html>
  );
}
