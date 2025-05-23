require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const winston = require('winston');
const { ethers } = require('ethers');
const { setupTradingBot } = require('./contracts');

const app = express();
const port = process.env.PORT || 3001;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// Trading bot state
let tradingBot = null;
let isTrading = false;

// Routes
app.post('/swapstart', async (req, res) => {
  try {
    if (isTrading) {
      return res.status(400).json({ error: 'Trading bot is already running' });
    }

    const {
      walletAddress,
      tokenAddress,
      slippage = process.env.DEFAULT_SLIPPAGE,
      gasPrice = process.env.DEFAULT_GAS_PRICE,
      gasLimit = process.env.DEFAULT_GAS_LIMIT
    } = req.body;

    if (!walletAddress || !tokenAddress) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    tradingBot = await setupTradingBot({
      walletAddress,
      tokenAddress,
      slippage,
      gasPrice,
      gasLimit
    });

    isTrading = true;
    logger.info('Trading bot started', { walletAddress, tokenAddress });
    res.json({ message: 'Trading bot started successfully' });
  } catch (error) {
    logger.error('Error starting trading bot', { error: error.message });
    res.status(500).json({ error: 'Failed to start trading bot' });
  }
});

app.post('/swapstop', (req, res) => {
  try {
    if (!isTrading) {
      return res.status(400).json({ error: 'Trading bot is not running' });
    }

    if (tradingBot) {
      tradingBot.stop();
      tradingBot = null;
    }

    isTrading = false;
    logger.info('Trading bot stopped');
    res.json({ message: 'Trading bot stopped successfully' });
  } catch (error) {
    logger.error('Error stopping trading bot', { error: error.message });
    res.status(500).json({ error: 'Failed to stop trading bot' });
  }
});

app.get('/status', (req, res) => {
  res.json({
    isTrading,
    lastTrade: tradingBot ? tradingBot.getLastTrade() : null
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});