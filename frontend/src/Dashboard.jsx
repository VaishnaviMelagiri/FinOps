import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

const API = 'http://127.0.0.1:8000';

function KPI({ label, value, sub, color = '#6366f1', trend }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(129, 140, 248, 0.05))',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        minWidth: '200px',
        flex: 1,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.6)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(129, 140, 248, 0.1))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.3)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(129, 140, 248, 0.05))';
      }}
    >
      <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </div>
      <div style={{ fontSize: '32px', fontWeight: 700, color, marginBottom: '8px' }}>{value}</div>
      {sub && (
        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>{sub}</span>
          {trend && (
            <span style={{ color: trend > 0 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
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
        setError('Could not load dashboard data. Make sure the backend is running on port 8000.');
      });
  }, []);

  if (error) {
    return (
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '24px', color: '#fca5a5' }}>
        <h3 style={{ marginTop: 0 }}>⚠️ Error Loading Data</h3>
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ color: '#94a3b8', padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '20px', marginBottom: '12px' }}>⏳</div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const costTrendData = data.cost_trend || [];
  const serviceSpendData = data.service_spend || [];
  const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

  return (
    <div style={{ display: 'grid', gap: '32px' }}>
      {/* KPI Cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <KPI label="Total Spend" value={`$${data.total_spend?.toLocaleString() || '0'}`} sub="Monthly" color="#6366f1" />
        <KPI label="EC2 Cost" value={`$${data.ec2_spend?.toLocaleString() || '0'}`} sub={`${data.ec2_running} running`} color="#818cf8" />
        <KPI label="Potential Savings" value={`$${data.potential_savings?.toLocaleString() || '0'}`} sub="From recommendations" color="#10b981" />
        <KPI label="Idle Instances" value={data.idle_count || 0} sub="Action required" color="#f59e0b" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px' }}>
        {/* Cost Trend */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(129, 140, 248, 0.02))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#f1f5f9' }}>💹 Cost Trend</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <LineChart data={costTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.2)" />
                <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Total" />
                <Line type="monotone" dataKey="ec2" stroke="#818cf8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="EC2" />
                <Line type="monotone" dataKey="rds" stroke="#a5b4fc" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="RDS" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Breakdown */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(129, 140, 248, 0.02))',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#f1f5f9' }}>📊 Service Breakdown</h3>
          <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={serviceSpendData} dataKey="spend" nameKey="service" cx="50%" cy="50%" outerRadius={100}>
                  {serviceSpendData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#1e293b',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px' }}>
            {serviceSpendData.slice(0, 4).map((service, i) => (
              <div key={service.service} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: COLORS[i % COLORS.length] }}></div>
                <span style={{ color: '#cbd5e1' }}>{service.service}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instances Table */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(129, 140, 248, 0.02))',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#f1f5f9' }}>⚙️ EC2 Instances</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.2)' }}>
                <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Name</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Type</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8', fontWeight: 500 }}>CPU</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Cost/mo</th>
                <th style={{ textAlign: 'left', padding: '12px', color: '#94a3b8', fontWeight: 500 }}>State</th>
              </tr>
            </thead>
            <tbody>
              {data.instances?.slice(0, 8).map((instance) => (
                <tr key={instance.id} style={{ borderBottom: '1px solid rgba(99, 102, 241, 0.1)', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px', color: '#cbd5e1', fontWeight: 500 }}>{instance.name}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{instance.type}</td>
                  <td style={{ padding: '12px', color: instance.cpu > 50 ? '#10b981' : instance.cpu < 5 ? '#ef4444' : '#f59e0b' }}>
                    {instance.cpu}%
                  </td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>${instance.cost}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: instance.state === 'running' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                      color: instance.state === 'running' ? '#10b981' : '#9ca3af',
                      fontWeight: 500,
                    }}>
                      {instance.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}