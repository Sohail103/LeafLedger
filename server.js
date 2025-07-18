const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const {
    Client,
    PrivateKey,
    AccountId,
    TopicMessageSubmitTransaction,
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
            topicId,
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

app.listen(3001, () => console.log("Backend running on http://localhost:3001"));