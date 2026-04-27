import Scenario from '../models/Scenario.js';

export const calculateOptimalStrategy = (req, res) => {
  const { prices, maxTransactions, fee } = req.body;

  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return res.status(400).json({ error: 'Invalid prices array' });
  }

  const n = prices.length;
  const k = Math.min(maxTransactions || Math.floor(n / 2), Math.floor(n / 2));
  const f = fee || 0;

  // dp[i][j][0]: day i, j transactions, 0 stock
  // dp[i][j][1]: day i, j transactions, 1 stock
  const dp = Array.from({ length: n }, () =>
    Array.from({ length: k + 1 }, () => [-Infinity, -Infinity])
  );

  // trace[i][j][state] = 'BUY', 'SELL', 'REST'
  const trace = Array.from({ length: n }, () =>
    Array.from({ length: k + 1 }, () => [null, null])
  );

  for (let j = 0; j <= k; j++) {
    dp[0][j][0] = 0;
    if (j > 0) {
      dp[0][j][1] = -prices[0];
      trace[0][j][1] = 'BUY';
    }
  }

  for (let i = 1; i < n; i++) {
    for (let j = 0; j <= k; j++) {
      // Not holding stock
      let rest0 = dp[i - 1][j][0];
      let sell = dp[i - 1][j][1] + prices[i] - f;

      if (sell > rest0) {
        dp[i][j][0] = sell;
        trace[i][j][0] = 'SELL';
      } else {
        dp[i][j][0] = rest0;
        trace[i][j][0] = 'REST';
      }

      // Holding stock
      if (j > 0) {
        let rest1 = dp[i - 1][j][1];
        let buy = dp[i - 1][j - 1][0] - prices[i];

        if (buy > rest1) {
          dp[i][j][1] = buy;
          trace[i][j][1] = 'BUY';
        } else {
          dp[i][j][1] = rest1;
          trace[i][j][1] = 'REST';
        }
      }
    }
  }

  // Find max profit
  let maxProfit = 0;
  let bestJ = 0;
  for (let j = 0; j <= k; j++) {
    if (dp[n - 1][j][0] > maxProfit) {
      maxProfit = dp[n - 1][j][0];
      bestJ = j;
    }
  }

  // Backtrack to find path
  const path = [];
  let currJ = bestJ;
  let currState = 0; // End up with 0 stock

  for (let i = n - 1; i >= 0; i--) {
    const action = trace[i][currJ][currState];
    if (!action) break;

    if (action !== 'REST') {
      path.unshift({ day: i, action, price: prices[i] });
    }

    if (action === 'SELL') {
      currState = 1; // Before selling, we had 1 stock
    } else if (action === 'BUY') {
      currState = 0; // Before buying, we had 0 stock
      currJ--;       // Buying consumed a transaction
    }
  }

  res.json({ maxProfit, path, dpTable: dp }); // dpTable can be used for Graph visualization
};

export const saveScenario = async (req, res) => {
  try {
    const scenario = new Scenario(req.body);
    await scenario.save();
    res.status(201).json(scenario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find().sort({ createdAt: -1 });
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
