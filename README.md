# Random Trading PancakeSwap Project

## Project Overview

### Description
The Random Trading PancakeSwap Project is a trading bot designed for PancakeSwap on the Binance Smart Chain (BSC). It operates by randomly executing buy and sell transactions using a specified wallet address and token pair, with configurable parameters such as slippage, gas price, and gas limit. The project utilizes Node.js for the backend server and React for the frontend interface.

### Key Features
- Automated trading bot for PancakeSwap on BSC.
- Configurable parameters for trades (wallet address, token address, slippage, gas settings).
- Real-time feedback and control through a React frontend.

## Architecture

### System Overview
The project consists of two main components:
- **Backend (Node.js/Express):** Handles trading logic, interacts with the Binance Smart Chain (BSC) and PancakeSwap smart contracts, exposes REST API endpoints for bot control, and manages configuration.
- **Frontend (React):** Provides a user interface for configuring, starting, and monitoring the trading bot. Communicates with the backend via HTTP requests.

**Architecture Diagram:**
```
[User] <-> [React Frontend] <-> [Node.js Backend] <-> [BSC Network & PancakeSwap]
```

### Key Files & Directories
- `server/app.js`: Main backend server logic and API endpoints.
- `server/contracts.js`: Smart contract interaction logic.
- `src/`: React frontend source code.
- `public/`: Static assets for the frontend.
- `package.json`: Project dependencies and scripts.

## Setup Instructions

### Prerequisites
- **Node.js v18.19.0** (recommended)
- **npm** (comes with Node.js)
- **Git**

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/pancakeswap-random-trade.git
   cd pancakeswap-random-trade
   ```
2. **Install dependencies for backend and frontend:**
   ```bash
   cd server && npm install
   cd ../ && cd src && npm install
   cd ../
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in the `server/` directory and fill in your BSC node URL, wallet private key, etc.
   - Example:
     ```env
     BSC_NODE_URL=https://bsc-dataseed.binance.org/
     WALLET_PRIVATE_KEY=your_private_key_here
     ```

### Running the Project
- **Start the backend:**
  ```bash
  cd server
  npm start
  ```
- **Start the frontend:**
  ```bash
  cd src
  npm start
  ```
- The frontend will be available at `http://localhost:3000` by default.

## Usage Examples

### Backend API
- **Start Trading:**
  ```http
  POST /swapstart
  Body: {
    "walletAddress": "0x...",
    "tokenAddress": "0x...",
    "slippage": 0.5,
    "gasPrice": 5,
    "gasLimit": 200000
  }
  ```
- **Stop Trading:**
  ```http
  POST /swapstop
  ```
- **Get Status:**
  ```http
  GET /status
  ```

### Frontend
- Navigate to the web UI, fill in the trading parameters, and use the Start/Stop buttons to control the bot.
- Real-time notifications will appear for each transaction attempt and result.

## Trading Logic & Randomness

### How Random Trading Works
- The bot randomly chooses between buy and sell actions at each interval.
- Trade amounts and timing can be randomized within user-defined bounds.
- Uses secure random number generation (via Node.js `crypto` or similar) to avoid predictable patterns.
- All trades are executed via PancakeSwap's router contract, ensuring on-chain transparency.

### Risk Management
- Users can set minimum/maximum trade amounts, slippage tolerance, and gas settings.
- The bot can be stopped at any time via the API or frontend.
- No funds are held by the bot; all trades are executed directly from the user's wallet.

## Configuration Reference

| Parameter      | Description                                 | Example Value         |
| ------------- | ------------------------------------------- | -------------------- |
| walletAddress  | BSC wallet address to use for trading       | 0x123...abc          |
| tokenAddress   | BEP-20 token contract address               | 0x456...def          |
| slippage       | Max slippage % for trades                   | 0.5                  |
| gasPrice       | Gas price in Gwei                           | 5                    |
| gasLimit       | Max gas per transaction                     | 200000               |
| minTradeAmount | Minimum BNB/token amount per trade          | 0.01                 |
| maxTradeAmount | Maximum BNB/token amount per trade          | 0.1                  |
| tradeInterval  | Time (seconds) between trades               | 60                   |

## Testing

### Backend
- Run unit tests:
  ```bash
  cd server
  npm test
  ```
- Tests are written using Mocha and Chai.

### Frontend
- Run UI tests:
  ```bash
  cd src
  npm test
  ```
- Uses React Testing Library for component and interaction tests.

## Deployment

- **Frontend:** Deploy to Netlify, Vercel, or similar static hosting.
- **Backend:** Deploy to AWS EC2, Heroku, or any Node.js-compatible cloud provider.
- Set environment variables securely in your deployment platform.

## Troubleshooting & FAQ

- **Q: My trades are failing with 'insufficient output amount'?**
  - A: Increase your slippage tolerance or check token liquidity.
- **Q: The bot is not starting.**
  - A: Ensure your `.env` is configured and your wallet has BNB for gas.
- **Q: How do I add a new token?**
  - A: Enter the token's contract address in the frontend or API request.
- **Q: Is my private key safe?**
  - A: The private key is only used locally by the backend and never sent to the frontend or third parties.

## Contribution Guidelines

1. Fork the repository and create a new branch for your feature or bugfix.
2. Write clear, concise commit messages.
3. Add tests for new features or bugfixes where applicable.
4. Submit a pull request with a detailed description of your changes.
5. Ensure your code passes all tests and linter checks before submitting.

## License

This project is licensed under the MIT License. See `LICENSE` for details.

## Roadmap

### Phase 1: Initial Setup and Development
**Timeline:** 1 Week

- **Setup Environment and Dependencies:**
  - Configure Node.js environment (`v18.19.0`).
  - Install necessary packages (`ethers`, `express`, `web3`, etc.).

- **Implement Backend Server (`server/app.js`):**
  - Develop endpoints for starting and stopping the trading bot (`/swapstart`, `/swapstop`).
  - Integrate with PancakeSwap router for token swaps using Ethereum smart contracts (`contracts.js`).

- **Build Frontend Interface (`src/`):**
  - Design and implement a React application (`App.js`, `index.js`) for user interaction.
  - Create forms for inputting trading parameters (wallet address, token address, slippage, gas settings).
  - Integrate notifications (`react-notifications`) for transaction feedback.

### Phase 2: Testing and Integration
**Timeline:** 2 Weeks

- **Backend Testing:**
  - Conduct unit tests for server endpoints (`Mocha`, `Chai`).
  - Simulate trading scenarios with mock data.

- **Frontend Testing:**
  - Perform UI/UX tests using React Testing Library (`@testing-library/react`).
  - Validate user inputs and interaction flows.

- **Integration Testing:**
  - Test end-to-end functionality of the bot from frontend initiation to backend execution.

### Phase 3: Deployment and Optimization
**Timeline:** 1 Week

- **Deployment:**
  - Prepare deployment scripts (`package.json`, `npm scripts`).
  - Deploy frontend on a hosting platform (e.g., Netlify, Vercel).
  - Deploy backend on a cloud provider (e.g., AWS EC2, Heroku).

- **Performance Optimization:**
  - Optimize gas usage and transaction efficiency.
  - Implement error handling and logging (`winston`, `morgan`).

### Phase 4: Maintenance and Future Enhancements
**Timeline:** Ongoing

- **Monitor and Maintain:**
  - Monitor bot performance and trading outcomes.
  - Address any bugs or issues reported by users.

- **Enhancements:**
  - Explore adding more advanced trading strategies.
  - Enhance UI/UX based on user feedback.
  - Integrate additional blockchain protocols or swap services.

## Conclusion
The Random Trading PancakeSwap Project aims to provide automated trading capabilities on PancakeSwap, leveraging Node.js and React for a scalable and user-friendly experience. Through careful development and testing phases, we aim to deliver a robust trading bot that meets the needs of cryptocurrency traders on the Binance Smart Chain.
