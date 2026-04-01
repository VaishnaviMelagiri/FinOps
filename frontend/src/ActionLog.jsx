export default function ActionLog({ log = [] }) {
  return (
    <div>
      <h2 style={{ marginBottom: '16px' }}>Approval Log</h2>

      {log.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No approvals yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {log.map((a, i) => (
            <div
              key={`${a.time || 'time'}-${i}`}
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: '#111827',
                border: '1px solid #1f2937',
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: '6px',
                  color: '#fff',
                }}
              >
                {a.title || a.message || 'Approved action'}
              </div>

              {a.message && a.title && (
                <div style={{ color: '#cbd5e1', marginBottom: '6px' }}>
                  {a.message}
                </div>
              )}

              {a.impact && (
                <div style={{ color: '#f59e0b', marginBottom: '4px' }}>
                  Impact: {a.impact}
                </div>
              )}

              {a.savings != null && (
                <div style={{ color: '#22c55e', marginBottom: '4px' }}>
                  Savings: {a.savings}
                </div>
              )}

              <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                {a.time || 'Just now'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}