'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';

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
    setIconName('Wrench');
  };

  const handleEdit = (tool) => {
    setEditingId(tool._id);
    setTitle(tool.title);
    setVersion(tool.version);
    setDescription(tool.description);
    setSize(tool.size);
    setLink(tool.link);
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
    
    const payload = { title, version, description, size, link, iconName };
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--accent-blue)' }}>Quản lý Tools</h2>
        <button onClick={handleLogout} style={{ 
          background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', 
          padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' 
        }}>Đăng xuất</button>
      </div>

      <div style={{
        background: 'var(--secondary-bg)', padding: '2rem', borderRadius: '12px',
        border: '1px solid var(--border-color)', marginBottom: '3rem'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-orange)' }}>
          {editingId ? 'Sửa thông tin Tool' : 'Thêm Tool mới'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={labelStyle}>Tên công cụ</label>
            <input required style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Link tải xuống (URL)</label>
            <input required type="url" style={inputStyle} value={link} onChange={e => setLink(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Phiên bản (VD: v1.0.0)</label>
            <input style={inputStyle} value={version} onChange={e => setVersion(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Dung lượng (VD: 15.2 MB)</label>
            <input style={inputStyle} value={size} onChange={e => setSize(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Icon Template (Lucide React)</label>
            <select style={inputStyle} value={iconName} onChange={e => setIconName(e.target.value)}>
              {iconOptions.map(ico => <option key={ico} value={ico}>{ico}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={labelStyle}>Mô tả</label>
            <textarea required style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)}></textarea>
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={formLoading} style={{
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-orange))',
              color: 'white', border: 'none', padding: '10px 24px', borderRadius: '6px',
              cursor: 'pointer', fontWeight: 'bold'
            }}>
              {formLoading ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm mới')}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{
                background: 'transparent', color: 'white', border: '1px solid var(--border-color)',
                padding: '10px 24px', borderRadius: '6px', cursor: 'pointer'
              }}>Huỷ</button>
            )}
          </div>
        </form>
      </div>

      <div style={{ background: 'var(--secondary-bg)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Danh sách hiện tại</h3>
        {loading ? (
          <div>Đang tải...</div>
        ) : tools.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)' }}>Chưa có data.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '12px' }}>Tên</th>
                <th style={{ padding: '12px' }}>Icon</th>
                <th style={{ padding: '12px' }}>Version</th>
                <th style={{ padding: '12px' }}>Link</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {tools.map(tool => (
                <tr key={tool._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--accent-blue)' }}>{tool.title}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{tool.iconName}</td>
                  <td style={{ padding: '12px' }}>{tool.version}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {tool.link}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => handleEdit(tool)} style={{ background: '#ffa502', color: '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>Sửa</button>
                    <button onClick={() => handleDelete(tool._id)} style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Xoá</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' };
const inputStyle = {
  width: '100%', padding: '10px', borderRadius: '6px',
  border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)',
  color: 'white', outline: 'none'
};
