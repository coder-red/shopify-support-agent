import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null)
  const [convs, setConvs] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setAnalytics)
    fetch('/api/conversations').then(r => r.json()).then(d => setConvs(d.conversations || []))
  }, [])

  const statusData = [
    { name: 'Open', value: convs.filter(c => c.status === 'open').length, fill: '#22C55E' },
    { name: 'Escalated', value: convs.filter(c => c.status === 'escalated').length, fill: '#F59E0B' },
  ]

  const s = analytics?.sentiment
  const sentimentData = s ? [
    { name: 'Positive', value: s.positive, color: '#22C55E' },
    { name: 'Neutral', value: s.neutral, color: '#8888A0' },
    { name: 'Negative', value: s.negative, color: '#EF4444' },
  ] : []
  const totalSentiment = sentimentData.reduce((a, b) => a + b.value, 0) || 1

  const cr = analytics?.cart_recovery
  const recoveryData = cr ? [
    { name: 'Recovered', value: cr.recovered, color: '#22C55E' },
    { name: 'Pending', value: (cr.total_carts || 0) - cr.recovered, color: '#F59E0B' },
  ] : []

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Analytics</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          { label: 'Conversations', value: analytics?.total_conversations ?? 0, color: '#5B5BD6' },
          { label: 'Messages', value: analytics?.total_messages ?? 0, color: '#22C55E' },
          { label: 'Escalated', value: analytics?.escalated_count ?? 0, color: '#F59E0B' },
          { label: 'Escalation Rate', value: `${analytics?.escalation_rate ?? 0}%`, color: '#EF4444' },
          { label: 'Channel', value: analytics?.channels?.[0] ?? 'webchat', color: '#8888A0' },
          { label: 'Recovery Rate', value: `${cr?.recovery_rate ?? 0}%`, color: '#059669' },
          { label: 'Recovered Revenue', value: cr?.recovered_revenue ?? '$0', color: '#0891B2' },
          { label: 'Positive Rate', value: `${s?.positive_rate ?? 0}%`, color: '#22C55E' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--color-surface)', borderRadius: 10,
            border: '1px solid var(--color-border)', padding: 16, textAlign: 'center',
          }}>
            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Conversation Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A45" />
              <XAxis dataKey="name" stroke="#8888A0" fontSize={12} />
              <YAxis stroke="#8888A0" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1A1A2E', border: '1px solid #2A2A45', borderRadius: 8, color: '#E8E8F0' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Sentiment</h2>
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            {sentimentData.map(d => (
              <div key={d.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span>{d.name}</span>
                  <span style={{ color: d.color, fontWeight: 600 }}>{d.value} ({Math.round(d.value / totalSentiment * 100)}%)</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.value / totalSentiment * 100}%`, background: d.color, borderRadius: 4, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Cart Recovery</h2>
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            {recoveryData.map(d => (
              <div key={d.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span>{d.name}</span>
                  <span style={{ color: d.color, fontWeight: 600 }}>{d.value}</span>
                </div>
                <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${d.value / (cr?.total_carts || 1) * 100}%`, background: d.color, borderRadius: 4 }} />
                </div>
              </div>
            ))}
            {cr && (
              <div style={{ marginTop: 12, fontSize: 13, color: 'var(--color-text-muted)' }}>
                <div>Potential revenue: <strong style={{ color: 'var(--color-text)' }}>{cr.potential_revenue}</strong></div>
                <div>Recovered: <strong style={{ color: '#22C55E' }}>{cr.recovered_revenue}</strong></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Escalations</h2>
        {convs.filter(c => c.status === 'escalated').length === 0 ? (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No escalations recorded.</div>
        ) : (
          <div style={{ fontSize: 13 }}>{convs.filter(c => c.status === 'escalated').length} escalated conversations</div>
        )}
      </div>
    </div>
  )
}
