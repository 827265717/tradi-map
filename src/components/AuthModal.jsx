import { useState } from 'react'
import { login, register } from '../api/client'
import './AuthModal.css'

export default function AuthModal({ onSuccess, onClose }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fn = tab === 'login' ? login : register
      const data = await fn(email, password)
      onSuccess(data.token, data.user)
    } catch (err) {
      // 后端返回的错误信息在 err.message 中，格式是 "API 4xx: /path"
      // 显示通用提示
      setError(tab === 'login' ? '邮箱或密码错误' : '注册失败，该邮箱可能已被注册')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${tab === 'login' ? 'modal-tab--active' : ''}`}
            onClick={() => { setTab('login'); setError('') }}
          >
            登录
          </button>
          <button
            className={`modal-tab ${tab === 'register' ? 'modal-tab--active' : ''}`}
            onClick={() => { setTab('register'); setError('') }}
          >
            注册
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="modal-input"
            type="email"
            placeholder="邮箱"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
          />
          <input
            className="modal-input"
            type="password"
            placeholder="密码（至少6位）"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="modal-error">{error}</p>}
          <button className="modal-submit" type="submit" disabled={loading}>
            {loading ? '请稍候…' : tab === 'login' ? '登录' : '注册'}
          </button>
        </form>
      </div>
    </div>
  )
}
