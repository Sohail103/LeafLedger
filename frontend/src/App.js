import React, { useState, useEffect, useRef } from "react";
import "./hedera-theme.css";
import LoadingScreen from "./LoadingScreen";
import LandingPage from "./LandingPage"; // Import your animated landing page
import FadeTransition from "./FadeTransition";
import MouseTrace from "./MouseTrace";

function App() {
  const [stage, setStage] = useState("loading"); // "loading", "landing", "main"
  const [topicId, setTopicId] = useState("");
  const [form, setForm] = useState({ from: "", to: "", amount: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [netAmounts, setNetAmounts] = useState(null);
  const landingTransitioning = useRef(false);

  useEffect(() => {
    if (stage === "loading") {
      const timer = setTimeout(() => setStage("landing"), 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Fetch and parse transactions from Hedera
  const getAndParseTransactions = async () => {
    if (!topicId) {
      setSubmitMsg("Please enter a Topic ID.");
      return;
    }
    setLoading(true);
    setSubmitMsg("Fetching transactions...");
    setNetAmounts(null);
    try {
      // Using our backend proxy for mirror node access
      const url = `/api/topic/${topicId}/messages`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (!data.messages || data.messages.length === 0) {
        setSubmitMsg("No transactions found for this topic.");
        setLoading(false);
        return;
      }

      const balances = {};

      data.messages.forEach(msg => {
        try {
          // Messages are base64 encoded
          const decodedMsg = atob(msg.message);
          const transaction = JSON.parse(decodedMsg);
          const { from, to, amount } = transaction;
          const parsedAmount = parseFloat(amount);

          if (isNaN(parsedAmount)) return;

          // Update balances
          balances[from] = (balances[from] || 0) - parsedAmount;
          balances[to] = (balances[to] || 0) + parsedAmount;
        } catch (e) {
          console.error("Skipping malformed message:", e);
        }
      });

      setNetAmounts(balances);
      setSubmitMsg("Calculation complete.");
    } catch (err) {
      console.error("Error fetching or parsing transactions:", err);
      setSubmitMsg("Failed to fetch or parse transactions. See console for details.");
    }
    setLoading(false);
  };

  // Submit transaction to backend
  const submitTransaction = async (e) => {
    e.preventDefault();
    setSubmitMsg("");
    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, topicId }),
      });
      const result = await res.json();
      if (!res.ok) {
        setSubmitMsg(result.message || "Error submitting transaction.");
      } else {
        setSubmitMsg(result.message || "Transaction submitted!");
        setForm({ from: "", to: "", amount: "", note: "" });
      }
    } catch {
      setSubmitMsg("Error submitting transaction.");
    }
    setLoading(false);
  };

  // Create new topic
  const createTopic = async () => {
    setLoading(true);
    setSubmitMsg("");
    try {
      const res = await fetch("/api/create-topic", { method: "POST" });
      const result = await res.json();
      if (result.topicId) {
        setTopicId(result.topicId);
        setSubmitMsg(`New topic created: ${result.topicId}`);
      } else {
        setSubmitMsg(result.message || "Error creating topic.");
      }
    } catch {
      setSubmitMsg("Error creating topic.");
    }
    setLoading(false);
  };

  const blocks = Array.from({ length: 12 });

  // Handle transition from landing page to main form
  const handleLandingFinish = () => {
    if (landingTransitioning.current) return;
    landingTransitioning.current = true;
    setStage("main");
  };

  if (stage === "loading") return <FadeTransition><LoadingScreen /></FadeTransition>;
  if (stage === "landing") return <FadeTransition><LandingPage onScrollDown={handleLandingFinish} /></FadeTransition>;

  // Main form UI
  return (
    <div className="hedera-app">
      {/* <MouseTrace /> */}
      <div className="blockchain-side blockchain-left">
        {blocks.map((_, i) => (
          <div
            key={i}
            className="blockchain-block"
            style={{
              animationDelay: `${(i % 3) * 0.7}s`,
              background:
                i % 3 === 0
                  ? "rgba(0, 255, 102, 0.12)"
                  : i % 3 === 1
                    ? "rgba(0, 255, 102, 0.18)"
                    : "rgba(0, 255, 102, 0.25)",
            }}
          />
        ))}
      </div>
      <div className="blockchain-side blockchain-right">
        {blocks.map((_, i) => (
          <div
            key={i}
            className="blockchain-block"
            style={{
              animationDelay: `${(i % 3) * 0.7}s`,
              background:
                i % 3 === 0
                  ? "rgba(0, 255, 102, 0.12)"
                  : i % 3 === 1
                    ? "rgba(0, 255, 102, 0.18)"
                    : "rgba(0, 255, 102, 0.25)",
            }}
          />
        ))}
      </div>
      <header>
        <h1>College Fest Ledger</h1>
        <p>Powered by Hedera Hashgraph</p>
      </header>
      <section className="card">
        <h2>Topic ID</h2>
        <input
          type="text"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          placeholder="Enter Topic ID"
        />
        <button onClick={createTopic} disabled={loading}>
          Create New Topic
        </button>
        <button onClick={getAndParseTransactions} disabled={loading || !topicId} style={{marginLeft: "1rem"}}>
          Calculate Net Amounts
        </button>
        <a
          href={topicId ? `https://hashscan.io/testnet/topic/${topicId}` : "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: "1rem", display: "inline-block" }}
        >
          View Topic on HashScan
        </a>
      </section>
      <section className="card">
        <h2>Submit Transaction</h2>
        <form onSubmit={submitTransaction}>
          <input
            type="text"
            placeholder="Sender"
            value={form.from}
            onChange={(e) => setForm({ ...form, from: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Receiver"
            value={form.to}
            onChange={(e) => setForm({ ...form, to: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            min="0.01"
            step="0.01"
          />
          <input
            type="text"
            placeholder="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <button type="submit" disabled={loading || !topicId}>
            Submit
          </button>
        </form>
        {submitMsg && <div className="msg">{submitMsg}</div>}
      </section>

      {netAmounts && (
        <section className="card">
          <h2>Net Amounts</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(netAmounts).map(([person, amount]) => (
                <tr key={person}>
                  <td>{person}</td>
                  <td className={amount > 0 ? "positive" : "negative"}>
                    {amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <footer>
        Sohail- FinTech Hackathon
      </footer>
    </div>
  );
}

export default App;