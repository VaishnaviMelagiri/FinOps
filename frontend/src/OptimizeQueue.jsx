const recommendations = [
  {
    id: 1,
    title: 'Merge low-utilization workload',
    message: 'Merged two underutilized workloads into one optimized cluster.',
    impact: 'High',
    savings: 42,
  },
  {
    id: 2,
    title: 'Right-size EC2 instances',
    message: 'Recommended smaller EC2 instances for non-peak workloads.',
    impact: 'Medium',
    savings: 28,
  },
  {
    id: 3,
    title: 'Shut down idle dev resources',
    message: 'Detected idle development resources outside working hours.',
    impact: 'High',
    savings: 18,
  },
  {
    id: 4,
    title: 'Move storage to lower-cost tier',
    message: 'Suggested lifecycle policy for stale objects in storage.',
    impact: 'Low',
    savings: 12,
  },
];

function impactColor(level) {
  if (level === 'High') return '#ef4444';
  if (level === 'Medium') return '#f59e0b';
  return '#22c55e';
}

export default function OptimizeQueue({ onApprove }) {
  return (
    <div>
      <h2 style={{ marginBottom: '16px' }}>Optimize Queue</h2>
      <div style={{ display: 'grid', gap: '16px' }}>
        {recommendations.map((item) => (
          <div
            key={item.id}
            style={{
              background: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: '12px',
                marginBottom: '10px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <h3 style={{ margin: 0, marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ margin: 0, color: '#9ca3af' }}>{item.message}</p>
              </div>

              <span
                style={{
                  padding: '6px 10px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  background: `${impactColor(item.impact)}22`,
                  color: impactColor(item.impact),
                  border: `1px solid ${impactColor(item.impact)}55`,
                }}
              >
                {item.impact}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ color: '#22c55e', fontWeight: 600 }}>
                Estimated savings: {item.savings}
              </div>

              <button
                onClick={() => onApprove(item)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#4a4ae8',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}