import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'GH-300 CertMaster',
  description: '公式資料を根拠に、一歩ずつ学ぶGitHub Copilot試験対策。非公式学習アプリ。',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = { themeColor: '#0b0f14', width: 'device-width', initialScale: 1 };
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
