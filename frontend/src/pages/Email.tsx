import { useEffect, useState } from 'react'

export default function Email() {
  const [emails, setEmails] = useState<any[]>([])
  const [from, setFrom] = useState('customer@example.com')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [response, setResponse] = useState('')

  useEffect(() => {
    fetch('/api/emails').then(r => r.json()).then(d => setEmails(d.emails || []))
  }, [])

  async function send() {
    const r = await fetch('/webhook/email', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from_address: from, subject, body }),
    })
    const d = await r.json()
    setResponse(d.response || 'Sent')
    fetch('/api/emails').then(r => r.json()).then(d => setEmails(d.emails || []))
    setSubject(''); setBody('')
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Email Inbox</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Received Emails</h2>
          {emails.length === 0 ? (
            <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>No emails received yet. Send a test email.</div>
          ) : emails.map((e, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{e.subject}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>From: {e.from} — {new Date(e.received_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--color-surface)', borderRadius: 12, border: '1px solid var(--color-border)', padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Send Test Email</h2>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-muted)' }}>From</label>
            <input value={from} onChange={e => setFrom(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-muted)' }}>Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 13 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4, color: 'var(--color-text-muted)' }}>Body</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Message body..." style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--color-border)', background: 'var(--color-bg)', color: 'var(--color-text)', fontSize: 13, minHeight: 80, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>
          <button onClick={send} style={{ padding: '8px 16px', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Send Email</button>
          {response && (
            <div style={{ marginTop: 12, padding: 12, background: '#00CC6620', borderRadius: 8, fontSize: 13, lineHeight: 1.5 }}>{response}</div>
          )}
        </div>
      </div>
    </div>
  )
}
