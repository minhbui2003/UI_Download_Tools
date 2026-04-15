import '../globals.css'; // ensure globals are loaded
import Link from 'next/link';
import * as Icons from 'lucide-react';

export const metadata = {
  title: 'Tools - POD SOFTWARE ',
};

export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ 
        padding: '1.5rem 2rem', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo.png" alt="Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} />
          <span style={{ fontWeight: '800', fontSize: '1.4rem', color: '#1e293b', letterSpacing: '-0.5px' }}>POD SOFTWARE</span>
        </div>
        <Link href="/" className="adminBtnHome">
          <Icons.Home size={20} />
          Trang chính
        </Link>
      </header>
      <main style={{ flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
