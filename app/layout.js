import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const appBackground = `
  radial-gradient(circle at 15% 50%, rgba(234, 178, 141, 0.8), transparent 50%),
  radial-gradient(circle at 85% 30%, rgba(116, 156, 196, 0.8), transparent 50%),
  radial-gradient(circle at 90% 80%, rgba(226, 214, 195, 0.9), transparent 50%),
  radial-gradient(circle at 10% 10%, rgba(221, 187, 96, 0.7), transparent 50%),
  linear-gradient(135deg, #f7d2b5, #c1d5e6)
`;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'POD TOOLS',
  description: 'Tools By IT POD SOFTWARE',
  openGraph: {
    title: 'POD TOOLS',
    description: 'Tools By IT POD SOFTWARE',
    url: siteUrl,
    siteName: 'POD TOOLS',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'POD SOFTWARE Logo',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" style={{ minHeight: '100%', background: appBackground }}>
      <body style={{ minHeight: '100vh', background: appBackground }}>
        {children}
      </body>
    </html>
  );
}
