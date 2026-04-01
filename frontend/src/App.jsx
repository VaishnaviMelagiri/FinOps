import { useState } from 'react';
import Dashboard from './Dashboard';
import Chat from './Chat';
import OptimizeQueue from './OptimizeQueue';
import ActionLog from './ActionLog';

const tabs = [
  { name: 'Dashboard', icon: '📊' },
  { name: 'Optimize', icon: '⚡' },
  { name: 'Ask CORA', icon: '💬' },
  { name: 'Log', icon: '📋' },
];

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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: '#f1f5f9',
        padding: '12px',
        fontFamily: 'Inter, Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .header-content {
          animation: fadeInDown 0.6s ease-out;
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="header-content" style={{ marginBottom: '32px', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              💰
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '36px', fontWeight: 700, letterSpacing: '-1px' }}>CORA</h1>
              <p style={{ margin: '4px 0 0 0', color: '#cbd5e1', fontSize: '14px' }}>Cost Optimization & Recommendations AI</p>
            </div>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '15px', lineHeight: '1.6' }}>
            Intelligent cloud cost optimization. Real-time insights, actionable recommendations, and automated savings tracking.
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            flexWrap: 'wrap',
            borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            paddingBottom: '16px',
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.name}
              onClick={() => setTab(t.name)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                background: tab === t.name 
                  ? 'linear-gradient(135deg, #6366f1, #818cf8)' 
                  : 'transparent',
                color: tab === t.name ? '#fff' : '#cbd5e1',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (tab !== t.name) {
                  e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                  e.target.style.color = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (tab !== t.name) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#cbd5e1';
                }
              }}
            >
              <span>{t.icon}</span>
              {t.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '16px',
            padding: '32px',
            minHeight: '500px',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
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