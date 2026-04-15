import './globals.css';

export const metadata = {
  title: 'POD TOOLS',
  description: 'Tools By IT POD SOFTWARE',
  openGraph: {
    title: 'POD TOOLS',
    description: 'Tools By IT POD SOFTWARE',
    url: 'https://podsoftware.vn', // thay bang URL that neu co
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
    <html lang="vi">
      <body>
        {children}
      </body>
    </html>
  );
}
