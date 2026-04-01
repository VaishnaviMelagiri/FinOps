import { useState, useEffect } from 'react';

const API = 'http://127.0.0.1:8000';

function impactColor(level) {
  if (level === 'High') return '#ef4444';
  if (level === 'Medium') return '#f59e0b';
  return '#10b981';
}

function impactBgColor(level) {
  if (level === 'High') return 'rgba(239, 68, 68, 0.1)';
  if (level === 'Medium') return 'rgba(245, 158, 11, 0.1)';
  return 'rgba(16, 185, 129, 0.1)';
}

export default function OptimizeQueue({ onApprove }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/recommendations`)
      .then((r) => r.json())
      .then((data) => {
        const formatted = data.map((rec) => ({
          id: rec.id,
          title: rec.instance_name,
          message: rec.reason,
          impact: rec.risk === 'low' ? 'Low' : rec.risk === 'medium' ? 'Medium' : 'High',
          savings: rec.savings,
          type: rec.type,
        }));
        setRecs(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load recommendations');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>Loading recommendations...</div>;
  }

  if (error) {
    return <div style={{ color: '#ef4444', padding: '20px' }}>{error}</div>;
  }

  if (recs.length === 0) {
    return <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>✨ No pending recommendations</div>;
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ color: '#cbd5e1', marginBottom: '8px' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          {recs.length} optimization{recs.length !== 1 ? 's' : ''} available • Potential savings: <span style={{ color: '#10b981', fontWeight: 600 }}>${recs.reduce((sum, r) => sum + r.savings, 0)}</span>
        </p>
      </div>
      
      <div style={{ display: 'grid', gap: '16px' }}>
        {recs.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(129, 140, 248, 0.02))',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.4)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(129, 140, 248, 0.05))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.2)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(129, 140, 248, 0.02))';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#f1f5f9', fontWeight: 600 }}>
                  {item.title}
                </h3>
                <p style={{ margin: '0 0 8px 0', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.5' }}>
                  {item.message}
                </p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
                  <span style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '12px', background: impactBgColor(item.impact), color: impactColor(item.impact), fontWeight: 500 }}>
                    {item.impact} Impact
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8', padding: '4px 0' }}>
                    Type: <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{item.type}</span>
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '140px' }}>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '12px' }}>Monthly Savings</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#10b981', marginBottom: '16px' }}>${item.savings}</div>
                <button
                  onClick={() => onApprove(item)}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 16px rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Approve ✓
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}