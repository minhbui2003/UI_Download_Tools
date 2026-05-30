'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import styles from './UserDropdown.module.css';

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setSession(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  if (loading) {
    return (
      <div className={styles.iconButton}>
        <Icons.Loader2 size={20} className={styles.spinner} />
      </div>
    );
  }

  if (!session?.authenticated) {
    return (
      <Link href="/login" className={styles.iconButton} title="Đăng nhập">
        <Icons.User size={20} />
      </Link>
    );
  }

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button 
        className={styles.iconButton} 
        onClick={() => setIsOpen(!isOpen)}
        title="Tài khoản"
      >
        <Icons.User size={20} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              <Icons.User size={24} />
            </div>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{session.user.username}</span>
              <span className={styles.userRole}>
                {session.user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
              </span>
            </div>
          </div>
          
          <div className={styles.divider}></div>

          {session.user.role === 'admin' && (
            <Link 
              href="/admin/dashboard" 
              className={styles.menuItem}
              onClick={() => setIsOpen(false)}
            >
              <Icons.LayoutDashboard size={16} />
              Trang quản trị
            </Link>
          )}

          <button 
            className={`${styles.menuItem} ${styles.logoutBtn}`}
            onClick={handleLogout}
          >
            <Icons.LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
