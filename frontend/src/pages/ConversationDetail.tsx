import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bot, User, Clock } from 'lucide-react'

export default function ConversationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/conversations/${id}`)
      .then(r => r.json())
      .then(d => {
        setMessages(d.messages || [])
        setLoading(false)
      })
  }, [id])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <button onClick={() => navigate('/conversations')} style={{
        display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)',
        background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, marginBottom: 16, padding: 0,
      }}>
        <ArrowLeft size={16} /> Back to Conversations
      </button>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Conversation: {id}</h1>
      <div style={{
        background: 'var(--color-surface)', borderRadius: 12,
        border: '1px solid var(--color-border)', padding: 20, maxWidth: 800,
      }}>
        {messages.length === 0 && <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>No messages in this conversation.</div>}
        {messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', gap: 10, marginBottom: 16,
            flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: m.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div style={{ maxWidth: '75%' }}>
              <div style={{
                padding: '10px 14px', borderRadius: 10, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap',
                background: m.role === 'user' ? 'var(--color-primary)' : 'var(--color-surface-light)',
                color: m.role === 'user' ? 'white' : 'var(--color-text)',
              }}>
                {typeof m.content === 'string' ? m.content : JSON.stringify(m.content)}
              </div>
              {m.timestamp && (
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={11} /> {new Date(m.timestamp).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
