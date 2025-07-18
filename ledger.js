// ledger.js

require("dotenv").config();
const {
    Client,
    PrivateKey,
    AccountId,
    TopicCreateTransaction,
    TopicMessageSubmitTransaction,
    TopicMessageQuery,
} = require("@hashgraph/sdk");

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
});

const operatorId = AccountId.fromString(process.env.OPERATOR_ID);
const operatorKey = PrivateKey.fromString(process.env.OPERATOR_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

let topicId = null;

async function createTopic() {
    try {
        const tx = await new TopicCreateTransaction().execute(client);
        const receipt = await tx.getReceipt(client);
        topicId = receipt.topicId;
        console.log(`✅ Created new topic: ${topicId.toString()}`);
    } catch (err) {
        console.error("❌ Error creating topic:", err.message);
        process.exit(1);
    }
}

async function submitTransaction() {
    if (!topicId) {
        console.error("❌ No topic created yet.");
        return;
    }

    readline.question("Sender name: ", (from) => {
        readline.question("Receiver name: ", (to) => {
            readline.question("Amount: ", (amount) => {
                const amt = parseFloat(amount);
                if (isNaN(amt) || amt <= 0) {
                    console.error("❌ Invalid amount. Please enter a positive number.");
                    return submitTransaction();
                }
                readline.question("Note: ", async (note) => {
                    const txn = {
                        from,
                        to,
                        amount: amt,
                        note,
                        timestamp: new Date().toISOString()
                    };

                    try {
                        const send = await new TopicMessageSubmitTransaction({
                            topicId,
                            message: JSON.stringify(txn)
                        }).execute(client);

                        const receipt = await send.getReceipt(client);
                        if (receipt.consensusTimestamp) {
                            console.log(`✅ Transaction submitted at ${receipt.consensusTimestamp.toString()}`);
                        } else {
                            console.log("✅ Transaction submitted, but no consensus timestamp returned.");
                        }
                    } catch (err) {
                        console.error("❌ Error submitting transaction:", err.message);
                    }

                    readline.question("Do you want to submit another transaction? (y/n): ", (answer) => {
                        if (answer.trim().toLowerCase() === "y") {
                            submitTransaction();
                        } else {
                            console.log("👋 Exiting. Thank you!");
                            readline.close();
                        }
                    });
                });
            });
        });
    });
}

async function main() {
    console.log("🎉 Welcome to the College Fest Ledger!");

    readline.question("Do you want to create a new topic? (y/n): ", async (ans) => {
        if (ans.trim().toLowerCase() === "y") {
            await createTopic();
        } else {
            readline.question("Enter existing topic ID: ", async (tid) => {
                try {
                    topicId = tid;
                    console.log(`ℹ️ Using existing topic: ${topicId}`);
                } catch (err) {
                    console.error("❌ Invalid topic ID.");
                    process.exit(1);
                }
            });
        }

        // Wait for topicId to be set before proceeding
        const waitForTopic = setInterval(() => {
            if (topicId) {
                clearInterval(waitForTopic);
                console.log("ℹ️  Your topic is now live. You can view it later on HashScan:");
                console.log(`🔗 https://hashscan.io/testnet/topic/${topicId.toString()}`);
                submitTransaction();
            }
        }, 500);
    });
}

main();
