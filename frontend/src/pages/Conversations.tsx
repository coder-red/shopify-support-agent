import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Conversations() {
  const [convs, setConvs] = useState<any[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(d => setConvs(d.conversations || []))
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Conversations</h1>
      <div style={{
        background: 'var(--color-surface)', borderRadius: 12,
        border: '1px solid var(--color-border)', overflow: 'hidden',
      }}>
        {convs.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
            <MessageSquare size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            No conversations yet. Send a message using the chat widget on the Dashboard.
          </div>
        )}
        {convs.map(c => (
          <div
            key={c.customer_identifier}
            onClick={() => navigate(`/conversations/${c.customer_identifier}`)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
              cursor: 'pointer', transition: 'background 0.15s',
              fontSize: 14,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: c.status === 'escalated' ? '#F59E0B20' : '#22C55E20',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {c.status === 'escalated' ? <AlertTriangle size={18} color="#F59E0B" /> : <CheckCircle size={18} color="#22C55E" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, marginBottom: 2 }}>{c.customer_identifier}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.last_message || 'No messages'}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12 }}>
              <div style={{ color: 'var(--color-text-muted)', marginBottom: 2 }}>{c.message_count} msgs</div>
              <span style={{
                color: c.status === 'escalated' ? 'var(--color-warning)' : 'var(--color-success)',
                fontWeight: 500,
              }}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
