import { useEffect, useState } from 'react'
import { MessageSquare, AlertTriangle, HeadphonesIcon, TrendingUp } from 'lucide-react'
import WebChat from '../components/WebChat'

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [convs, setConvs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setStats)
    fetch('/api/conversations').then(r => r.json()).then(d => setConvs(d.conversations || []))
    setLoading(false)
  }, [])

  if (loading) return <div>Loading...</div>

  const cards = [
    { label: 'Conversations', value: stats?.total_conversations ?? 0, icon: MessageSquare, color: '#5B5BD6' },
    { label: 'Messages', value: stats?.total_messages ?? 0, icon: TrendingUp, color: '#22C55E' },
    { label: 'Escalations', value: stats?.escalated_count ?? 0, icon: AlertTriangle, color: '#F59E0B' },
    { label: 'Escalation Rate', value: `${stats?.escalation_rate ?? 0}%`, icon: HeadphonesIcon, color: '#EF4444' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: 'var(--color-surface)', borderRadius: 12,
            border: '1px solid var(--color-border)', padding: '20px',
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: `${c.color}20`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <c.icon size={22} color={c.color} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{c.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{
          background: 'var(--color-surface)', borderRadius: 12,
          border: '1px solid var(--color-border)', padding: 20,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Recent Conversations</h2>
          {convs.slice(0, 5).map(c => (
            <div key={c.customer_identifier} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '10px 0', borderBottom: '1px solid var(--color-border)',
              fontSize: 13,
            }}>
              <span style={{ fontWeight: 500 }}>{c.customer_identifier}</span>
              <span style={{
                color: c.status === 'escalated' ? 'var(--color-warning)' : 'var(--color-success)',
              }}>{c.status}</span>
            </div>
          ))}
          {convs.length === 0 && (
            <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No conversations yet. Try the chat widget!</div>
          )}
        </div>

        <div style={{
          background: 'var(--color-surface)', borderRadius: 12,
          border: '1px solid var(--color-border)', padding: 20,
        }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Test the Agent</h2>
          <WebChat />
        </div>
      </div>
    </div>
  )
}
