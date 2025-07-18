# College Fest Ledger (Hedera Hackathon Submission)

## Setup

1. Clone the repo:
   ```
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   cd ..
   ```

4. Create a `.env` file in the root with your Hedera credentials:
   ```
   OPERATOR_ID=0.0.xxxxxxx
   OPERATOR_KEY=302e020100300506032b657004220420xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

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

## Notes

- Do **not** commit your real `.env` file. Use `.env.example` for sharing.