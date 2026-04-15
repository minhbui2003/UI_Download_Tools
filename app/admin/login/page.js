'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      router.push('/admin/dashboard');
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '450px',
      margin: '5rem auto',
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(12px)',
      padding: '3rem',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.6)',
      boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem', fontWeight: '800', color: '#1e293b', letterSpacing: '-0.5px' }}>Đăng nhập Quản trị</h2>
      {error && (
        <div style={{ background: 'rgba(255, 0, 0, 0.1)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center', fontSize: '1rem', fontWeight: '500' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1.1rem', color: '#475569', fontWeight: '600' }}>Tài khoản</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.1)', background: 'white',
              color: '#1e293b', outline: 'none', fontSize: '1.1rem', transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0284c7'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1.1rem', color: '#475569', fontWeight: '600' }}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%', padding: '14px', borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.1)', background: 'white',
              color: '#1e293b', outline: 'none', fontSize: '1.1rem', transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0284c7'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '1rem',
            padding: '16px',
            background: 'linear-gradient(135deg, #0284c7, #ea580c)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '700',
            fontSize: '1.2rem',
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.25)',
            opacity: loading ? 0.7 : 1,
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
}
