import React, { useState } from "react";
import "./hedera-theme.css";

function App() {
  const [topicId, setTopicId] = useState("");
  const [form, setForm] = useState({ from: "", to: "", amount: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");

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

  return (
    <div className="hedera-app">
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
    </div>
  );
}

export default App;