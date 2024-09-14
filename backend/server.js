const axios = require("axios");
const express = require("express");
const { CohereClient } = require("cohere-ai");

// Import the API key from the .env file
require("dotenv").config();
const apiKey = process.env.COHERE_API_KEY;

const cohere = new CohereClient({
  token: apiKey,
});

const app = express();

let chatHistory = [];

// {user: number, action: [string]}
let actionsList = [];

function generateActions(message) {}

app.get("/chat", async (req, res) => {
  const { message, userId } = req.query;

  const action = actionsList?.find((action) => action.user === user);
  if (!action) {
    generateActions(message, userId);
  }

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const chatStream = await cohere.chatStream({
      chatHistory,
      message: message ?? "Hello",
      connectors: [{ id: "web-search" }],
    });

    let aiResponse = "";

    // Stream the response to the client
    for await (const data of chatStream) {
      if (data.eventType === "text-generation") {
        res.write(JSON.stringify(data));
        aiResponse += data;
      }
    }

    // End the response when done
    res.end();

    // Add the user and chatbot messages to the chat history
    chatHistory.push({ role: "USER", message });
    chatHistory.push({ role: "CHATBOT", message: aiResponse });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while processing your request.");
  }
});

app.listen(8000, async () => {
  let response = await cohere.checkApiKey();

  if (!response.valid) throw new Error("Invalid API key");

  console.log("Server is running at http://localhost:8000");
});
