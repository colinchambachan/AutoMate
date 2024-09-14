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

// {user: number, actions: [string]} (NOTE ACTIONS IS A LIST OF STRINGS)
let actionsList = [];

/**
 * Generate the list of actions in JSON format you need to perform to acheive this final result
 * returns true if the action is generated successfully
 *
 * @param {string} message
 * @param {number} userId
 * @returns {boolean}
 */
async function generateActions(message, userId) {
  try {
    const response = await cohere.chat({
      message: `Generate the detailed list of actions in JSON format you need to perform to acheive this final result
      The format should be ["action1", "action2", ...] and each action should be a string.
      Here is the final result: ${message}`,
    });

    actionsList.push({ userId, actions: JSON.parse(response.text) });
    console.log("actionList", actionsList);
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

app.get("/chat", async (req, res) => {
  const { message, userId } = req.query;

  //   let message = "send an email to John using gmail";
  //   let userId = 1;

  if (!message || !userId) {
    return res.status(400).send("Missing required parameters");
  }

  let actions = actionsList?.find((action) => action.userId === userId);

  if (!actions || actions.length === 0) {
    console.log("got here", message, userId);
    const isGenerated = await generateActions(message, userId);
    if (!isGenerated) {
      return res
        .status(500)
        .send("An error occurred while generating steps for your action.");
    } else {
      actions = actionsList?.find((action) => action.userId === userId);
    }
  }

  console.log("actions", actions);

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  try {
    const chatStream = await cohere.chatStream({
      chatHistory,
      message: actions.actions.shift(),
      connectors: [{ id: "web-search" }],
    });

    let aiResponse = "";

    // Stream the response to the client
    for await (const data of chatStream) {
      if (data.eventType === "text-generation") {
        res.write(JSON.stringify(data));
        aiResponse += data.text;
      }
    }

    // End the response when done
    res.end();

    // Add the user and chatbot messages to the chat history
    chatHistory.push({ role: "USER", message });
    chatHistory.push({ role: "CHATBOT", message: aiResponse });
    console.log("chatHistory", chatHistory);
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
