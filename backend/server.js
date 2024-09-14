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

app.listen(8000, async () => {
  let respone = await cohere.checkApiKey();

  console.log(respone);

  console.log(`Server is running on port 8000.`);

  response = await await cohere.chat({
    message: "hello world!",
  });
  console.log(response);
});
