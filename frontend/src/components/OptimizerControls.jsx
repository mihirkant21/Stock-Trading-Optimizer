import React, { useState } from 'react';

const OptimizerControls = ({ onOptimize, loading }) => {
  const [maxTransactions, setMaxTransactions] = useState(3);
  const [fee, setFee] = useState(1);
  const [days, setDays] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    onOptimize({
      maxTransactions: parseInt(maxTransactions) || 1,
      fee: parseFloat(fee) || 0,
      days: parseInt(days) || 30,
    });
  };

  return (
    <>
      {/* Controls Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="card-icon card-icon-cyan">⚙️</span>
            Optimizer Settings
          </div>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>

            {/* Max Transactions */}
            <div className="form-group">
              <label className="form-label" htmlFor="maxTransactions">
                Max Transactions (k)
              </label>
              <input
                type="number"
                id="maxTransactions"
                className="form-input"
                value={maxTransactions}
                onChange={(e) => setMaxTransactions(e.target.value)}
                min="1"
                placeholder="e.g. 3"
              />
            </div>

            {/* Transaction Fee */}
            <div className="form-group">
              <label className="form-label" htmlFor="fee">
                Transaction Fee ($)
              </label>
              <input
                type="number"
                id="fee"
                className="form-input"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                min="0"
                step="0.5"
                placeholder="e.g. 1.5"
              />
            </div>

            {/* Data Window */}
            <div className="form-group">
              <label className="form-label" htmlFor="days">
                Data Window (days)
              </label>
              <input
                type="number"
                id="days"
                className="form-input"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                min="5"
                placeholder="e.g. 30"
              />
            </div>

            <div className="divider" />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="run-optimizer-btn"
            >
              {loading ? (
                <>
                  <div className="btn-spinner" />
                  Computing…
                </>
              ) : (
                '▶  Run Optimizer'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Algorithm Info Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <span className="card-icon card-icon-green">🧠</span>
            Algorithm
          </div>
        </div>
        <div className="card-body" style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '0.75rem' }}>
            Uses a <strong style={{ color: 'var(--cyan-bright)' }}>3D Dynamic Programming</strong> table over
            a DAG of stock states to find the globally optimal buy/sell sequence.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>Time complexity</span>
              <code style={{ color: 'var(--yellow)', fontSize: '0.78rem' }}>O(n × k)</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>Space complexity</span>
              <code style={{ color: 'var(--yellow)', fontSize: '0.78rem' }}>O(n × k)</code>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-3)' }}>States</span>
              <code style={{ color: 'var(--yellow)', fontSize: '0.78rem' }}>hold / rest</code>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OptimizerControls;
