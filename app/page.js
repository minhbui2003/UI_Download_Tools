'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import * as Icons from 'lucide-react';

export default function Home() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tools')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTools(data);
        } else {
          setTools([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tools:', err);
        setLoading(false);
      });
  }, []);

  const getIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Wrench;
    return <IconComponent size={24} strokeWidth={1.5} />;
  };

  return (
    <main className={styles.main}>
      {/* Top Left Logo Array */}
      <div className={styles.topBarLogo}>
        <img src="/logo.png" alt="POD SOFTWARE Logo" />
        <span className={styles.companyName}>POD SOFTWARE</span>
      </div>

      {/* Login Icon in Top Right */}
      <Link href="/admin/dashboard" className={styles.loginIcon} title="Đăng nhập Admin">
        <Icons.User size={20} />
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>
          Công cụ <span className={styles.highlight}>POD</span> miễn phí
        </h1>
        <p className={styles.subtitle}>
          Tải về các công cụ hỗ trợ Print on Demand. Tối ưu hóa quy trình làm việc của bạn với bộ sưu tập tools chuyên nghiệp.
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>Đang tải danh sách công cụ...</div>
      ) : (
        <div className={styles.grid}>
          {tools.length === 0 ? (
            <div className={styles.loading} style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              Chưa có công cụ nào được cập nhật.
            </div>
          ) : (
            tools.map((tool) => (
              <div key={tool._id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper}>
                    {getIcon(tool.iconName)}
                  </div>
                  <div>
                    <h3 className={styles.cardTitle}>{tool.title}</h3>
                    <span className={styles.cardVersion}>{tool.version}</span>
                  </div>
                </div>

                <p className={styles.cardDesc}>{tool.description}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.cardSize}>{tool.size}</span>
                  <a href={tool.link} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
                    <Icons.Download size={16} /> Tải xuống
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <footer className={styles.footer}>
        By IT POD SOFTWARE &copy; {new Date().getFullYear()}. All rights reserved.
      </footer>
    </main>
  );
}
