import { useEffect, useState } from 'react'

export default function CartRecovery() {
  const [carts, setCarts] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)

  async function load() {
    const [cartsR, statsR] = await Promise.all([
      fetch('/store/carts/abandoned'),
      fetch('/store/carts/recovery-stats'),
    ])
    setCarts((await cartsR.json()).carts || [])
    setStats(await statsR.json())
  }

  useEffect(() => { load() }, [])

  async function recover(id: number) {
    await fetch(`/store/carts/${id}/recover`, { method: 'POST' })
    load()
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Cart Recovery</h1>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total Carts', value: stats.total_carts, color: '#8888A0' },
            { label: 'Recovered', value: stats.recovered, color: '#22C55E' },
            { label: 'Sent', value: stats.sent, color: '#F59E0B' },
            { label: 'Pending', value: stats.pending, color: '#6B7280' },
            { label: 'Recovery Rate', value: `${stats.recovery_rate}%`, color: '#5B5BD6' },
            { label: 'Recovered Revenue', value: stats.recovered_revenue, color: '#059669' },
            { label: 'Potential Revenue', value: stats.potential_revenue, color: '#0891B2' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--color-surface)', borderRadius: 10, border: '1px solid var(--color-border)', padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Abandoned Carts</h2>
        {carts.length === 0 ? (
          <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No abandoned carts.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Items</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {carts.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px 12px' }}>
                    <div style={{ fontWeight: 600 }}>{c.customer_name}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{c.customer_email}</div>
                  </td>
                  <td style={{ padding: '8px 12px', fontSize: 12 }}>{c.items.map((i: any) => `${i.quantity}x ${i.title.split(' - ')[0]}`).join(', ')}</td>
                  <td style={{ padding: '8px 12px' }}>${c.total}</td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600,
                      background: c.recovery_status === 'recovered' ? '#00CC6620' : c.recovery_status === 'sent' ? '#F59E0B20' : '#6B728020',
                      color: c.recovery_status === 'recovered' ? '#22C55E' : c.recovery_status === 'sent' ? '#F59E0B' : '#6B7280',
                    }}>{c.recovery_status}</span>
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    {c.recovery_status !== 'recovered' ? (
                      <button onClick={() => recover(c.id)} style={{ padding: '4px 10px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Send Recovery</button>
                    ) : (
                      <span style={{ fontSize: 12, color: '#22C55E' }}>Order #{c.recovered_order_id || '-'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
