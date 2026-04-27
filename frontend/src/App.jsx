import React, { useState, useEffect } from 'react';
import OptimizerControls from './components/OptimizerControls';
import StockChart from './components/StockChart';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastParams, setLastParams] = useState({ maxTransactions: 2, fee: 0 });

  const generateMockData = (days = 30) => {
    const prices = [];
    let price = 100 + Math.random() * 50;
    for (let i = 0; i < days; i++) {
      price = price + (Math.random() - 0.45) * 12;
      prices.push(Math.max(10, parseFloat(price.toFixed(2))));
    }
    return prices;
  };

  // Auto-run with demo data on mount
  useEffect(() => {
    handleOptimize({ maxTransactions: 3, fee: 1 }, true);
  }, []);

  const handleOptimize = async (params, isDemo = false) => {
    setLoading(true);
    setError(null);
    if (!isDemo) setLastParams(params);

    const prices = generateMockData(params.days || 30);

    try {
      const response = await fetch('http://localhost:5000/api/optimizer/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prices,
          maxTransactions: params.maxTransactions,
          fee: params.fee,
        }),
      });

      if (!response.ok) throw new Error('Server error');
      const result = await response.json();
      setData({ ...result, prices });
    } catch (err) {
      setError('Could not connect to backend. Running client-side calculation.');
      // Fallback: run DP on client
      const result = clientDP(prices, params.maxTransactions, params.fee);
      setData({ ...result, prices });
    }
    setLoading(false);
  };

  // Client-side DP fallback
  const clientDP = (prices, k, fee) => {
    const n = prices.length;
    const maxK = Math.min(k, Math.floor(n / 2));
    const f = fee || 0;

    const dp = Array.from({ length: n }, () =>
      Array.from({ length: maxK + 1 }, () => [-Infinity, -Infinity])
    );
    const trace = Array.from({ length: n }, () =>
      Array.from({ length: maxK + 1 }, () => [null, null])
    );

    for (let j = 0; j <= maxK; j++) {
      dp[0][j][0] = 0;
      if (j > 0) { dp[0][j][1] = -prices[0]; trace[0][j][1] = 'BUY'; }
    }

    for (let i = 1; i < n; i++) {
      for (let j = 0; j <= maxK; j++) {
        const rest0 = dp[i - 1][j][0];
        const sell  = dp[i - 1][j][1] + prices[i] - f;
        if (sell > rest0) { dp[i][j][0] = sell; trace[i][j][0] = 'SELL'; }
        else { dp[i][j][0] = rest0; trace[i][j][0] = 'REST'; }

        if (j > 0) {
          const rest1 = dp[i - 1][j][1];
          const buy   = dp[i - 1][j - 1][0] - prices[i];
          if (buy > rest1) { dp[i][j][1] = buy; trace[i][j][1] = 'BUY'; }
          else { dp[i][j][1] = rest1; trace[i][j][1] = 'REST'; }
        }
      }
    }

    let maxProfit = 0, bestJ = 0;
    for (let j = 0; j <= maxK; j++) {
      if (dp[n - 1][j][0] > maxProfit) { maxProfit = dp[n - 1][j][0]; bestJ = j; }
    }

    const path = [];
    let currJ = bestJ, currState = 0;
    for (let i = n - 1; i >= 0; i--) {
      const action = trace[i][currJ][currState];
      if (!action) break;
      if (action !== 'REST') path.unshift({ day: i, action, price: prices[i] });
      if (action === 'SELL') currState = 1;
      else if (action === 'BUY') { currState = 0; currJ--; }
    }

    return { maxProfit, path };
  };

  const priceChange = data
    ? ((data.prices[data.prices.length - 1] - data.prices[0]) / data.prices[0] * 100).toFixed(2)
    : null;

  return (
    <div className="app-shell">
      {/* ── Top Nav ── */}
      <nav className="topnav">
        <div className="topnav-logo">
          <div className="logo-icon">📈</div>
          StockOptimizer
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="topnav-badge">Graph + DP Engine</span>
          {error && (
            <span className="topnav-badge" style={{ background: 'rgba(252,129,129,0.1)', color: 'var(--red)', borderColor: 'rgba(252,129,129,0.2)' }}>
              ⚡ Offline Mode
            </span>
          )}
        </div>
      </nav>

      <div className="page-layout">
        {/* ── Left Sidebar ── */}
        <aside className="sidebar">
          <OptimizerControls onOptimize={handleOptimize} loading={loading} />
        </aside>

        {/* ── Main Content ── */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', minWidth: 0 }}>
          {/* Hero stats row */}
          {data && (
            <div className="hero-stats">
              <div className="stat-card anim-in">
                <div className="stat-label">Max Profit</div>
                <div className={`stat-value ${data.maxProfit > 0 ? 'green' : 'red'}`}>
                  ${data.maxProfit.toFixed(2)}
                </div>
                <div>
                  <span className={`stat-tag ${data.maxProfit > 0 ? 'up' : 'down'}`}>
                    {data.maxProfit > 0 ? '↑' : '↓'} Optimal
                  </span>
                </div>
              </div>
              <div className="stat-card anim-in anim-in-1">
                <div className="stat-label">Price Change</div>
                <div className={`stat-value ${parseFloat(priceChange) >= 0 ? 'cyan' : 'red'}`}>
                  {priceChange}%
                </div>
                <div className="stat-sub">Start → End of period</div>
              </div>
              <div className="stat-card anim-in anim-in-2">
                <div className="stat-label">Trades</div>
                <div className="stat-value cyan">{data.path.length}</div>
                <div className="stat-sub">
                  {data.path.filter(p => p.action === 'BUY').length} buy ·{' '}
                  {data.path.filter(p => p.action === 'SELL').length} sell
                </div>
              </div>
            </div>
          )}

          {/* Chart card */}
          <div className="card anim-in">
            <div className="card-header">
              <div className="card-title">
                <span className="card-icon card-icon-cyan">📊</span>
                Price Chart & Trade Signals
              </div>
              {data && (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                  {data.prices.length} days
                </span>
              )}
            </div>

            {data ? (
              <>
                <div className="chart-wrap" style={{ padding: '0 0.5rem' }}>
                  <StockChart prices={data.prices} path={data.path} />
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: 'var(--cyan)' }}></div>
                    Price
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: 'var(--green-bright)' }}></div>
                    Buy Signal
                  </div>
                  <div className="legend-item">
                    <div className="legend-dot" style={{ background: 'var(--red-bright)' }}></div>
                    Sell Signal
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📈</div>
                <p>Run the optimizer to see the price chart and optimal buy/sell signals.</p>
              </div>
            )}
          </div>

          {/* Results */}
          {data && <ResultsPanel result={data} />}
        </main>
      </div>
    </div>
  );
}

export default App;
