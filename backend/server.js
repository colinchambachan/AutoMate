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

app.get("/chat", async (req, res) => {
  const { message } = req.query;

  const response = await cohere.chat({
    message: message,
  });

  res.status(200).json(response);
});

app.listen(8000, async () => {
  let response = await cohere.checkApiKey();

  if (!response.valid) throw new Error("Invalid API key");

  console.log("Server is running at http://localhost:8000");
});
