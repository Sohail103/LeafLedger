# College Fest Ledger (FinTech Hackathon Submission)

## Setup

1. Create a hedera testnet account on https://portal.hedera.com/register

2. Clone the repo:
   ```
   git clone https://github.com/Sohail103/sohail-fintech-hackathon-submission.git
   cd sohail-fintech-hackathon-submission
   ```

3. Install backend dependencies:
   ```
   npm install
   ```

4. Install frontend dependencies:
   ```
   cd frontend
   npm install
   cd ..
   ```

5. Create a `.env` file in the root with your Hedera credentials:
   ```
   OPERATOR_ID=0.0.xxxxxxx
   OPERATOR_KEY=302e020100300506032b657004220420xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   
   (OPERATOR_ID: Account ID, OPERATOR_KEY: DER encoded private key) 

## Running

- Start the backend:
  ```
  node server.js
  ```

- Start the frontend:
  ```
  cd frontend
  npm start
  ```

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Verified working hedera topic ID: 0.0.6370391 (https://hashscan.io/testnet/topic/0.0.6370391)


## About Hedera Hashgraph

Hedera is a public distributed ledger platform designed to offer a fast, secure, and energy-efficient alternative to traditional blockchain technologies. Unlike blockchains like Bitcoin and Ethereum that rely on Proof-of-Work (PoW) or Proof-of-Stake (PoS), Hedera is built on a unique consensus mechanism called Hashgraph.

### How Hedera Works: Hashgraph Consensus

The Hashgraph consensus algorithm, invented by Dr. Leemon Baird, does not use blocks or mining. Instead, it uses two core ideas: **gossip about gossip** and **virtual voting**.

- **Gossip about Gossip**: Each node in the network randomly communicates with other nodes, sharing not only new transactions but also information about how and when it learned of them. This creates a detailed history of message flow across the network.
- **Virtual Voting**: Because every node receives the same transaction history, they can independently determine the outcome of votes without exchanging actual vote messages. This significantly reduces communication overhead and enables quick consensus.

This design allows Hedera to reach asynchronous Byzantine Fault Tolerance (aBFT), a high level of security where the system can function correctly even if some nodes act maliciously. The result is high throughput, low latency, and strong security guarantees—all while consuming very little energy compared to traditional blockchains.

### Why This Project Uses Hedera

In this project, we built a public payment ledger to record transactions between students during a college fest. While the actual payments are made via UPI or other external services, this system acts as an immutable record of contributions, expenses, and reimbursements.

Hedera was chosen for several reasons:

- **Speed and Scalability**: Transactions are finalized within seconds, making it suitable for handling many updates during the event.
- **Transparency**: The public ledger enables all stakeholders to verify entries, increasing trust and accountability.
- **Developer-Friendly SDK**: Hedera provides a straightforward JavaScript SDK, allowing easy integration with minimal overhead.
- **Free Testing Environment**: The Hedera testnet supports development and testing without requiring real currency or fees.

The transactions can then be collected and parsed after the fest to compute the net amount of money spent by each student and reimbursements to be paid.

## Future improvements:

- Better UI
- facility to automatically collect transactions from the hedera mirror node REST APIs and calculate net amount owed to each student

## Transaction flow

![transaction-flow](transaction-flow.png)

## Overall project structure

![project-structure](mermaid-chart-project-structure.png)

(diagrams generated with mermaid.js)