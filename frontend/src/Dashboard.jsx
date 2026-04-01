import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const API = 'http://localhost:8000';

function KPI({ label, value, sub, color = '#4a4ae8' }) {
  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: 12,
        padding: 16,
        minWidth: 180,
        flex: 1,
      }}
    >
      <div style={{ fontSize: 14, color: '#9ca3af', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
      {sub && (
        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ totalSaved = 0, actionsCount = 0 }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API}/api/dashboard`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch dashboard data');
        return r.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error(err);
        setError('Could not load dashboard data.');
      });
  }, []);

  if (error) {
    return (
      <div style={{ color: '#f87171', padding: 20 }}>
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ color: '#9ca3af', padding: 20 }}>
        Loading dashboard...
      </div>
    );
  }

  const savingsTrend = data.savingsTrend || [
    { day: 'Mon', value: 20 },
    { day: 'Tue', value: 35 },
    { day: 'Wed', value: 28 },
    { day: 'Thu', value: 40 },
    { day: 'Fri', value: 52 },
  ];

  const actionsByType = data.actionsByType || [
    { name: 'Reschedule', count: 4 },
    { name: 'Merge', count: 6 },
    { name: 'Optimize', count: 3 },
    { name: 'Escalate', count: 2 },
  ];

  const avgWait = data.avgWait ?? '18 min';
  const utilization = data.utilization ?? '84%';

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <KPI
          label="Total Saved"
          value={totalSaved}
          sub="Minutes recovered"
          color="#22c55e"
        />
        <KPI
          label="Approved Actions"
          value={actionsCount}
          sub="Accepted recommendations"
          color="#60a5fa"
        />
        <KPI
          label="Average Wait"
          value={avgWait}
          sub="Current queue estimate"
          color="#f59e0b"
        />
        <KPI
          label="Utilization"
          value={utilization}
          sub="Resource usage"
          color="#a78bfa"
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
        }}
      >
        <div
          style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <h3 style={{ marginBottom: 16 }}>Savings Trend</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={savingsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#4a4ae8"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <h3 style={{ marginBottom: 16 }}>Actions by Type</h3>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={actionsByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}