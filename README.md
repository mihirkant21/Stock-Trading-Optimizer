# 📈 Stock Trading Optimizer — Graph + DP

A full-stack **MERN** web application that finds the **maximum-profit trading strategy** for any stock price series using **Dynamic Programming** on a Directed Acyclic Graph (DAG) of market states.

## ✨ Features

| Feature | Details |
|---|---|
| **DP Engine** | 3-D DP table `dp[day][transactions][holding]` — O(n × k) time |
| **Graph Model** | Each `(day, k, state)` triplet is a DAG node; backtracking finds the optimal path |
| **Trade Signals** | Visual **B** / **S** markers plotted on an interactive area chart |
| **Per-trade P&L** | Breakdown of profit/loss for every individual buy-sell pair |
| **Configurable** | Adjust max transactions, transaction fee, and data window freely |
| **Offline Mode** | Falls back to a client-side DP if the backend is unavailable |
| **MongoDB Persistence** | Save and retrieve past optimization scenarios |
| **Premium Dark UI** | Glassmorphism cards, animated gradients, Space Grotesk + Inter fonts |

---

## 🏗️ Tech Stack

### Frontend
- **React 18** (Vite)
- **Recharts** — area chart with custom tooltips
- **Lucide React** — icon set
- **Vanilla CSS** — custom design system, no Tailwind

### Backend
- **Node.js** + **Express 5**
- **Mongoose** + **MongoDB**
- **dotenv**, **cors**, **nodemon**

---

## 📁 Project Structure

```
stock-trading-optimizer/
├── backend/
│   ├── controllers/
│   │   └── optimizerController.js   # DP algorithm + CRUD
│   ├── models/
│   │   └── Scenario.js              # Mongoose schema
│   ├── routes/
│   │   └── optimizerRoutes.js
│   ├── .env.example
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── OptimizerControls.jsx
│       │   ├── StockChart.jsx
│       │   └── ResultsPanel.jsx
│       ├── App.jsx
│       └── index.css
│
├── package.json                     # Root — runs both servers via concurrently
└── README.md
```

---

## 🧠 Algorithm — How It Works

The core is a **3-D Dynamic Programming** solution to the classic _"Best Time to Buy and Sell Stock with at most k transactions"_ problem.

### State Definition
```
dp[i][j][0] = max profit on day i, using j transactions, NOT holding stock
dp[i][j][1] = max profit on day i, using j transactions, HOLDING stock
```

### Transitions
```
dp[i][j][0] = max(dp[i-1][j][0],          // rest
                   dp[i-1][j][1] + price[i] - fee)  // sell
dp[i][j][1] = max(dp[i-1][j][1],          // hold
                   dp[i-1][j-1][0] - price[i])      // buy
```

### Graph View
Each state `(day, k, holding)` is a **node in a DAG**. Edges represent:
- `REST` → same state, next day
- `BUY`  → (day-1, k-1, 0) → (day, k, 1)
- `SELL` → (day-1, k, 1) → (day, k, 0)

Backtracking through the DAG reveals the **exact optimal sequence** of trades.

**Complexity:** `O(n × k)` time · `O(n × k)` space

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/stock-trading-optimizer.git
cd stock-trading-optimizer
```

### 2. Configure environment
```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGODB_URI if needed
cd ..
```

### 3. Install dependencies
```bash
# Root (concurrently)
npm install

# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

### 4. Run in development
```bash
npm start
```
This launches both servers concurrently:
- **Backend** → `http://localhost:5000`
- **Frontend** → `http://localhost:5173`

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/optimizer/calculate` | Run DP and return max profit + path |
| `POST` | `/api/optimizer/save` | Save a scenario to MongoDB |
| `GET`  | `/api/optimizer/scenarios` | Fetch all saved scenarios |

### Example request — `/api/optimizer/calculate`
```json
{
  "prices": [100, 115, 95, 130, 120, 145],
  "maxTransactions": 2,
  "fee": 1.5
}
```

### Example response
```json
{
  "maxProfit": 47.5,
  "path": [
    { "day": 0, "action": "BUY",  "price": 100 },
    { "day": 3, "action": "SELL", "price": 130 },
    { "day": 4, "action": "BUY",  "price": 120 },
    { "day": 5, "action": "SELL", "price": 145 }
  ]
}
```

---

## 🛠️ Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run frontend + backend together (root) |
| `npm run server` | Run backend only |
| `npm run client` | Run frontend only |
| `npm run dev` (in `/backend`) | Run backend with nodemon |
| `npm run dev` (in `/frontend`) | Run Vite dev server |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

MIT © 2026

---

