import React, { useState } from "react";
import "./hedera-theme.css";

const HASHSCAN_BASE = "https://hashscan.io/api/v1/messages/topic/";

function App() {
    const [topicId, setTopicId] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [form, setForm] = useState({ from: "", to: "", amount: "", note: "" });
    const [loading, setLoading] = useState(false);
    const [submitMsg, setSubmitMsg] = useState("");

    // Fetch transactions from HashScan
    const fetchTransactions = async () => {
        setLoading(true);
        setTransactions([]);
        try {
            const res = await fetch(HASHSCAN_BASE + topicId + "?network=testnet");
            const data = await res.json();
            // Parse messages
            const txns = data.messages
                .map((msg) => {
                    try {
                        return JSON.parse(msg.message);
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean);
            setTransactions(txns);
        } catch (err) {
            setTransactions([]);
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
            setSubmitMsg(result.message || "Transaction submitted!");
            setForm({ from: "", to: "", amount: "", note: "" });
        } catch {
            setSubmitMsg("Error submitting transaction.");
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
                <button onClick={fetchTransactions} disabled={!topicId || loading}>
                    Retrieve Transactions
                </button>
                <a
                    href={`https://hashscan.io/testnet/topic/${topicId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View on HashScan
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
            <section className="card">
                <h2>Transactions</h2>
                {loading && <div>Loading...</div>}
                {!loading && transactions.length === 0 && <div>No transactions found.</div>}
                <ul>
                    {transactions.map((txn, idx) => (
                        <li key={idx}>
                            <strong>{txn.from}</strong> ➡️ <strong>{txn.to}</strong> : <span>{txn.amount}</span>
                            <br />
                            <em>{txn.note}</em>
                            <br />
                            <small>{txn.timestamp}</small>
                        </li>
                    ))}
                </ul>
            </section>
            <footer>
                <span>
                    <img src="https://hedera.com/favicon.ico" alt="Hedera" style={{ height: "20px" }} /> Hedera Hackathon
                </span>
            </footer>
        </div>
    );
}

export default App;