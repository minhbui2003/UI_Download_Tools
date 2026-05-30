import '../globals.css'; // ensure globals are loaded
import Image from 'next/image';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import UserDropdown from '../components/UserDropdown';
import styles from './layout.module.css';

export const metadata = {
  title: 'Tools - POD SOFTWARE ',
};

export default function AdminLayout({ children }) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Image src="/logo.png" alt="POD SOFTWARE Logo" width={44} height={44} priority />
          <span className={styles.brandName}>POD SOFTWARE</span>
        </div>
        <div className={styles.headerRight}>
          <Link href="/" className={styles.homeLink}>
            <Icons.Home size={20} />
            Trang chính
          </Link>
          <UserDropdown />
        </div>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
