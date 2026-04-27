import mongoose from 'mongoose';

const ScenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prices: { type: [Number], required: true },
  maxTransactions: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  cooldown: { type: Number, default: 0 },
  maxProfit: { type: Number },
  optimalPath: [{
    day: Number,
    action: String, // 'BUY', 'SELL', 'REST'
    profit: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Scenario', ScenarioSchema);
