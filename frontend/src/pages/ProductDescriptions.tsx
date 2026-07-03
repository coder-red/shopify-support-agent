import { useState } from 'react'

export default function ProductDescriptions() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [features, setFeatures] = useState('')
  const [audience, setAudience] = useState('online shoppers')
  const [loading, setLoading] = useState(false)
  const [variations, setVariations] = useState<string[]>([])

  async function generate() {
    if (!name || !category || !features) return
    setLoading(true)
    setVariations([])
    try {
      const r = await fetch('/api/generate-descriptions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, features, audience }),
      })
      const d = await r.json()
      const parts = d.variations.split(/\n(?=Variation \d)/)
      setVariations(parts)
    } catch (e: any) {
      setVariations([`Error: ${e.message}`])
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Product Descriptions</h1>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 24 }}>
        Enter product details and get 3 variations of marketing copy written by AI.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 20 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-muted)' }}>Product Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Eco-Friendly Water Bottle" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-muted)' }}>Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Kitchen & Dining" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-muted)' }}>Key Features</label>
            <textarea value={features} onChange={e => setFeatures(e.target.value)} placeholder="e.g. BPA-free, 750ml capacity, double-wall insulation..." style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 13, minHeight: 80, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-muted)' }}>Target Audience</label>
            <input value={audience} onChange={e => setAudience(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 13 }} />
          </div>
          <button onClick={generate} disabled={loading || !name || !category || !features} style={{
            padding: '10px 20px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: loading || !name || !category || !features ? 0.6 : 1,
          }}>{loading ? 'Generating...' : 'Generate 3 Variations'}</button>
        </div>

        <div>
          {variations.length > 0 && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Results for "{name}"</h2>
              {variations.map((v, i) => {
                const lines = v.trim().split('\n')
                const title = lines[0].replace(/:$/, '')
                const text = lines.slice(1).join(' ').trim()
                return (
                  <div key={i} style={{
                    background: 'var(--color-bg)', borderRadius: 8,
                    borderLeft: '3px solid var(--color-primary)', padding: '12px 16px', marginBottom: 12,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-text)' }}>{text}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
