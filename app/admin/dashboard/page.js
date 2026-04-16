'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminDashboard() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('v1.0.0');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState('');
  const [link, setLink] = useState('');
  const [macLink, setMacLink] = useState('');
  const [iconName, setIconName] = useState('Wrench');
  const [formLoading, setFormLoading] = useState(false);

  const router = useRouter();

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tools');
      const data = await res.json();
      setTools(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setVersion('v1.0.0');
    setDescription('');
    setSize('');
    setLink('');
    setMacLink('');
    setIconName('Wrench');
  };

  const handleEdit = (tool) => {
    setEditingId(tool._id);
    setTitle(tool.title);
    setVersion(tool.version);
    setDescription(tool.description);
    setSize(tool.size);
    setLink(tool.link);
    setMacLink(tool.macLink || '');
    setIconName(tool.iconName || 'Wrench');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa tool này?')) return;
    try {
      await fetch(`/api/tools/${id}`, { method: 'DELETE' });
      fetchTools();
    } catch (err) {
      alert('Lỗi xóa tool');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    
    const payload = { title, version, description, size, link, macLink, iconName };
    const url = editingId ? `/api/tools/${editingId}` : '/api/tools';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        resetForm();
        fetchTools();
      } else {
        const data = await res.json();
        alert(data.error || 'Lưu thất bại');
      }
    } catch (err) {
      alert('Lỗi kết nối');
    } finally {
      setFormLoading(false);
    }
  };

  const iconOptions = ['Wrench', 'Image', 'Palette', 'UploadCloud', 'DownloadCloud', 'Search', 'Scissors', 'FileText', 'Settings', 'Database', 'Layout'];

  return (
    <div className={styles.dashboard}>
      <div className={styles.topBar}>
        <h2 className={styles.title}>Quản lý Tools</h2>
        <button onClick={handleLogout} className={styles.logoutButton}>Đăng xuất</button>
      </div>

      <section className={styles.panel}>
        <h3 className={styles.panelTitle}>
          {editingId ? 'Sửa thông tin Tool' : 'Thêm Tool mới'}
        </h3>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.field}>
            <label className={styles.label}>Tên công cụ</label>
            <input required className={styles.input} value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Phiên bản (VD: v1.0.0)</label>
            <input className={styles.input} value={version} onChange={e => setVersion(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Link tải Windows (URL)</label>
            <input required type="url" className={styles.input} value={link} onChange={e => setLink(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Link tải macOS (URL)</label>
            <input type="url" className={styles.input} value={macLink} onChange={e => setMacLink(e.target.value)} placeholder="Có thể để trống nếu chưa có bản macOS" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Dung lượng (VD: 15.2 MB)</label>
            <input className={styles.input} value={size} onChange={e => setSize(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Icon Template (Lucide React)</label>
            <select className={styles.input} value={iconName} onChange={e => setIconName(e.target.value)}>
              {iconOptions.map(ico => <option key={ico} value={ico}>{ico}</option>)}
            </select>
          </div>
          <div className={styles.fullWidth}>
            <label className={styles.label}>Mô tả</label>
            <textarea required className={`${styles.input} ${styles.textarea}`} value={description} onChange={e => setDescription(e.target.value)}></textarea>
          </div>
          <div className={styles.formActions}>
            <button type="submit" disabled={formLoading} className={styles.primaryButton}>
              {formLoading ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm mới')}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className={styles.secondaryButton}>Huỷ</button>
            )}
          </div>
        </form>
      </section>

      <section className={styles.panel}>
        <h3 className={styles.listTitle}>Danh sách hiện tại</h3>
        {loading ? (
          <div className={styles.muted}>Đang tải...</div>
        ) : tools.length === 0 ? (
          <div className={styles.muted}>Chưa có data.</div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Icon</th>
                  <th>Version</th>
                  <th>Windows</th>
                  <th>macOS</th>
                  <th className={styles.actionsHeader}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tools.map(tool => (
                  <tr key={tool._id}>
                    <td className={styles.toolName}>{tool.title}</td>
                    <td className={styles.mutedCell}>{tool.iconName}</td>
                    <td>{tool.version}</td>
                    <td className={styles.linkCell}>{tool.link}</td>
                    <td className={styles.linkCell}>{tool.macLink || 'Chưa có'}</td>
                    <td className={styles.rowActions}>
                      <button onClick={() => handleEdit(tool)} className={styles.editButton}>Sửa</button>
                      <button onClick={() => handleDelete(tool._id)} className={styles.deleteButton}>Xoá</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
