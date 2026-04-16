'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import * as Icons from 'lucide-react';

const getIcon = (iconName) => {
  const IconComponent = Icons[iconName] || Icons.Wrench;
  return <IconComponent size={24} strokeWidth={1.5} />;
};

function ToolCard({ tool, onShowDetails }) {
  const descRef = useRef(null);
  const [isClamped, setIsClamped] = useState(false);

  useEffect(() => {
    const descElement = descRef.current;
    if (!descElement) return;

    const checkClamp = () => {
      setIsClamped(descElement.scrollHeight > descElement.clientHeight + 1);
    };

    checkClamp();

    const resizeObserver = new ResizeObserver(checkClamp);
    resizeObserver.observe(descElement);
    window.addEventListener('resize', checkClamp);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkClamp);
    };
  }, [tool.description]);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          {getIcon(tool.iconName)}
        </div>
        <div className={styles.cardHeading}>
          <h3 className={styles.cardTitle}>{tool.title}</h3>
          <span className={styles.cardVersion}>{tool.version}</span>
        </div>
      </div>

      <p ref={descRef} className={styles.cardDesc}>{tool.description}</p>
      {isClamped && (
        <button
          type="button"
          className={styles.detailButton}
          onClick={() => onShowDetails(tool)}
        >
          Xem chi tiết
        </button>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.cardSize}>{tool.size}</span>
        <a href={tool.link} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
          <Icons.Download size={16} /> Tải xuống
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState(null);

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

  return (
    <main className={styles.main}>
      {/* Top Left Logo Array */}
      <div className={styles.topBarLogo}>
        <Image src="/logo.png" alt="POD SOFTWARE Logo" width={44} height={44} priority />
        <span className={styles.companyName}>POD SOFTWARE</span>
      </div>

      {/* Login Icon in Top Right */}
      <Link href="/admin/dashboard" className={styles.loginIcon} title="Đăng nhập Admin">
        <Icons.User size={20} />
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>
          Công cụ <span className={styles.highlight}>POD</span> nội bộ
        </h1>
        <p className={styles.subtitle}>
          Tải về các công cụ hỗ trợ Print on Demand. Tối ưu hóa quy trình làm việc của các phòng ban giúp hỗ trợ tăng năng suất làm việc.
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>Đang tải danh sách công cụ...</div>
      ) : (
        <div className={styles.grid}>
          {tools.length === 0 ? (
            <div className={`${styles.loading} ${styles.emptyState}`}>
              Chưa có công cụ nào được cập nhật.
            </div>
          ) : (
            tools.map((tool) => (
              <ToolCard key={tool._id} tool={tool} onShowDetails={setSelectedTool} />
            ))
          )}
        </div>
      )}

      {selectedTool && (
        <div className={styles.modalBackdrop} onClick={() => setSelectedTool(null)}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="tool-detail-title" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalClose}
              onClick={() => setSelectedTool(null)}
              aria-label="Đóng chi tiết"
            >
              <Icons.X size={18} />
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.iconWrapper}>
                {getIcon(selectedTool.iconName)}
              </div>
              <div>
                <h2 id="tool-detail-title" className={styles.modalTitle}>{selectedTool.title}</h2>
                <span className={styles.cardVersion}>{selectedTool.version}</span>
              </div>
            </div>
            <p className={styles.modalDesc}>{selectedTool.description}</p>
            <div className={styles.modalFooter}>
              <span className={styles.cardSize}>{selectedTool.size}</span>
              <a href={selectedTool.link} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
                <Icons.Download size={16} /> Tải xuống
              </a>
            </div>
          </div>
        </div>
      )}

      <footer className={styles.footer}>
        By IT POD SOFTWARE &copy; {new Date().getFullYear()}. All rights reserved.
      </footer>
    </main>
  );
}
