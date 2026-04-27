import React, { useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot,
} from 'recharts';

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(8,13,24,0.95)',
      border: '1px solid rgba(99,179,237,0.3)',
      borderRadius: '8px',
      padding: '0.6rem 0.9rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
    }}>
      <div style={{ fontSize: '0.75rem', color: '#5a6a88', marginBottom: '0.25rem' }}>Day {label}</div>
      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#90cdf4' }}>
        ${payload[0].value.toFixed(2)}
      </div>
    </div>
  );
};

const StockChart = ({ prices, path }) => {
  const data = useMemo(
    () => prices.map((price, day) => ({ day, price })),
    [prices]
  );

  const buyPoints  = path.filter(p => p.action === 'BUY');
  const sellPoints = path.filter(p => p.action === 'SELL');

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#63b3ed" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#63b3ed" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,179,237,0.07)" />

        <XAxis
          dataKey="day"
          stroke="transparent"
          tick={{ fill: '#5a6a88', fontSize: 11 }}
          tickLine={false}
          label={{ value: 'Day', position: 'insideBottom', offset: -2, fill: '#5a6a88', fontSize: 11 }}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: '#5a6a88', fontSize: 11 }}
          tickLine={false}
          tickFormatter={(v) => `$${v}`}
          width={55}
          domain={['auto', 'auto']}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="price"
          stroke="#63b3ed"
          strokeWidth={2.5}
          fill="url(#priceGrad)"
          dot={false}
          activeDot={{ r: 5, fill: '#90cdf4', stroke: 'rgba(144,205,244,0.3)', strokeWidth: 4 }}
        />

        {buyPoints.map((p, i) => (
          <ReferenceDot
            key={`b${i}`}
            x={p.day}
            y={p.price}
            r={7}
            fill="#68d391"
            stroke="rgba(104,211,145,0.3)"
            strokeWidth={4}
            label={{ value: 'B', position: 'top', fill: '#9ae6b4', fontSize: 10, fontWeight: 700 }}
          />
        ))}

        {sellPoints.map((p, i) => (
          <ReferenceDot
            key={`s${i}`}
            x={p.day}
            y={p.price}
            r={7}
            fill="#fc8181"
            stroke="rgba(252,129,129,0.3)"
            strokeWidth={4}
            label={{ value: 'S', position: 'top', fill: '#feb2b2', fontSize: 10, fontWeight: 700 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
