const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const {
    Client,
    PrivateKey,
    AccountId,
    TopicMessageSubmitTransaction,
    TopicId,
    TopicCreateTransaction,
} = require("@hashgraph/sdk");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);
const client = Client.forTestnet().setOperator(operatorId, operatorKey);

app.post("/api/submit", async (req, res) => {
    const { topicId, from, to, amount, note } = req.body;
    if (!topicId || !from || !to || !amount) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const txn = {
        from,
        to,
        amount: parseFloat(amount),
        note,
        timestamp: new Date().toISOString(),
    };
    try {
        const send = await new TopicMessageSubmitTransaction({
            topicId: TopicId.fromString(topicId),
            message: JSON.stringify(txn),
        }).execute(client);
        const receipt = await send.getReceipt(client);
        res.json({
            message: receipt.consensusTimestamp
                ? `Transaction submitted at ${receipt.consensusTimestamp.toString()}`
                : "Transaction submitted!",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const axios = require("axios");

app.post("/api/create-topic", async (req, res) => {
    try {
        const tx = await new TopicCreateTransaction().execute(client);
        const receipt = await tx.getReceipt(client);
        const topicId = receipt.topicId.toString();
        res.json({ topicId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/api/topic/:topicId/messages", async (req, res) => {
    const { topicId } = req.params;
    if (!topicId) {
        return res.status(400).json({ message: "Missing Topic ID" });
    }

    try {
        const url = `https://testnet.mirrornode.hedera.com/api/v1/topics/${topicId}/messages`;
        const response = await axios.get(url);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Error fetching from Hedera Mirror Node:", error.response ? error.response.data : error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data : "Failed to fetch data from Hedera Mirror Node.";
        res.status(status).json({ message });
    }
});


app.listen(3001, () => console.log("Backend running on http://localhost:3001"));