import { useState } from 'react';
import Dashboard from './Dashboard';
import Chat from './Chat';
import OptimizeQueue from './OptimizeQueue';
import ActionLog from './ActionLog';

const tabs = ['Dashboard', 'Optimize', 'Ask CORA', 'Log'];

export default function App() {
  const [tab, setTab] = useState('Dashboard');
  const [log, setLog] = useState([]);
  const [saved, setSaved] = useState(0);

  const handleApprove = (result) => {
    const entry = {
      ...result,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setLog((prev) => [entry, ...prev]);
    setSaved((prev) => prev + (result.savings || 0));
    setTab('Log');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b1120',
        color: '#fff',
        padding: '24px',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: 0, fontSize: '32px' }}>CORA Dashboard</h1>
          <p style={{ marginTop: '8px', color: '#9ca3af' }}>
            Cloud optimization, approvals, insights, and savings tracking.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
          }}
        >
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: '1px solid #374151',
                background: tab === t ? '#4a4ae8' : 'transparent',
                color: tab === t ? '#fff' : '#9ca3af',
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div
          style={{
            background: 'rgba(17, 24, 39, 0.85)',
            borderRadius: 16,
            padding: '20px',
            minHeight: '420px',
            border: '1px solid #1f2937',
            backdropFilter: 'blur(8px)',
          }}
        >
          {tab === 'Dashboard' && (
            <Dashboard totalSaved={saved} actionsCount={log.length} />
          )}

          {tab === 'Optimize' && (
            <OptimizeQueue onApprove={handleApprove} />
          )}

          {tab === 'Ask CORA' && <Chat />}

          {tab === 'Log' && <ActionLog log={log} />}
        </div>
      </div>
    </div>
  );
}