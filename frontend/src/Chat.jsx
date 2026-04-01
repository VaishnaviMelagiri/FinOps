import { useState, useRef, useEffect } from 'react';

const API = 'http://127.0.0.1:8000';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'cora',
      text: "Hi! I'm CORA, your FinOps agent. Ask me about cloud cost trends, waste, savings, or optimization ideas.",
      suggestions: [
        'Why did AWS spend spike this week?',
        'Show my top savings opportunities',
        'What services are underutilized?',
      ],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (forcedQuestion) => {
    const q = (forcedQuestion ?? input).trim();
    if (!q || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'cora',
          text:
            data.answer ||
            'I received your question, but no answer was returned.',
          insights: data.insights || [],
          suggestions: data.suggestions || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'cora',
          text: 'Sorry, I could not reach the backend right now.',
          insights: [],
          suggestions: ['Try again', 'Check API server', 'Review network logs'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickAsk = (q) => {
    send(q);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '70vh',
      }}
    >
      <div
        style={{
          background: '#111827',
          border: '1px solid #1f2937',
          borderRadius: 16,
          padding: 16,
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 16,
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 14px',
                borderRadius: 14,
                background: m.role === 'user' ? '#4a4ae8' : '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: '#9ca3af',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {m.role === 'user' ? 'You' : 'CORA'}
              </div>

              <div style={{ lineHeight: 1.5 }}>{m.text}</div>

              {m.role === 'cora' && m.insights?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#93c5fd',
                      marginBottom: 6,
                    }}
                  >
                    Insights
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, color: '#d1d5db' }}>
                    {m.insights.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {m.role === 'cora' && m.suggestions?.length > 0 && (
                <div
                  style={{
                    marginTop: 12,
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {m.suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => quickAsk(s)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 16,
                        border: '1px solid #374151',
                        background: 'transparent',
                        color: '#93c5fd',
                        cursor: 'pointer',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ color: '#9ca3af', padding: '4px 8px' }}>
            CORA is thinking...
          </div>
        )}

        <div ref={endRef} />
      </div>

      <div
        style={{
          display: 'flex',
          gap: 10,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask about your AWS costs..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 12,
            border: '1px solid #374151',
            background: '#0f172a',
            color: '#fff',
            outline: 'none',
          }}
        />

        <button
          onClick={() => send()}
          disabled={loading}
          style={{
            padding: '12px 18px',
            borderRadius: 12,
            border: 'none',
            background: loading ? '#374151' : '#4a4ae8',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}