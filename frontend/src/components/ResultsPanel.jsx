import React from 'react';

const ResultsPanel = ({ result }) => {
  if (!result) return null;
  const { maxProfit, path } = result;

  const buys  = path.filter(p => p.action === 'BUY');
  const sells = path.filter(p => p.action === 'SELL');

  // Compute per-trade P&L
  const trades = buys.map((b, i) => ({
    buyDay: b.day,
    buyPrice: b.price,
    sellDay:  sells[i]?.day,
    sellPrice: sells[i]?.price,
    pnl: sells[i] ? sells[i].price - b.price : null,
  }));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
      {/* Trade Path */}
      <div className="card anim-in">
        <div className="card-header">
          <div className="card-title">
            <span className="card-icon card-icon-green">📋</span>
            Optimal Trade Sequence
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>{path.length} signals</span>
        </div>
        <div className="card-body">
          {path.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-3)', padding: '1.5rem' }}>
              No profitable trades found with current settings.
            </div>
          ) : (
            <ul className="path-list">
              {path.map((step, i) => (
                <li key={i} className="path-item">
                  <div>
                    <div className="path-day">Day {step.day}</div>
                    <div className="path-price">${step.price.toFixed(2)}</div>
                  </div>
                  <span className={`badge badge-${step.action.toLowerCase()}`}>{step.action}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Trade Analysis */}
      <div className="card anim-in anim-in-1">
        <div className="card-header">
          <div className="card-title">
            <span className="card-icon card-icon-red">💹</span>
            Trade Analysis
          </div>
        </div>
        <div className="card-body">
          {/* Profit summary */}
          <div style={{
            background: 'rgba(104,211,145,0.08)',
            border: '1px solid rgba(104,211,145,0.2)',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              Total Maximum Profit
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '2.2rem', fontWeight: 700, color: maxProfit > 0 ? 'var(--green-bright)' : 'var(--red-bright)' }}>
              ${maxProfit.toFixed(2)}
            </div>
          </div>

          {/* Per-trade breakdown */}
          {trades.length > 0 && (
            <>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Per-trade breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {trades.map((t, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.6rem 0.75rem',
                    background: 'rgba(0,0,0,0.2)',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                  }}>
                    <span style={{ color: 'var(--text-2)' }}>
                      Trade {i + 1} · D{t.buyDay}→{t.sellDay ?? '?'}
                    </span>
                    {t.pnl !== null ? (
                      <span style={{ fontWeight: 600, color: t.pnl >= 0 ? 'var(--green-bright)' : 'var(--red-bright)' }}>
                        {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-3)' }}>Open</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;
