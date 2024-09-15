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
 * @param {string} currentURL
 * @returns {boolean}
 */
async function generateActions(message, userId, currentURL) {
  try {
    const response = await cohere.chat({
      message: `Generate a detailed, step-by-step list of minimal actions, formatted as an array of strings in JSON, that need to be performed in a browser to achieve the following final result. 
Each action should be a simple string describing what to do. The final array should look like: ["action1", "action2", ...] and the last action should be "DONE". 
Final result: ${message}
Current page URL: ${currentURL}`,
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
  const { message, userId, htmlDOM, currentURL } = req.query;

  if (!message || !userId || !htmlDOM || !currentURL) {
    return res.status(400).send("Missing required parameters");
  }

  // Get the list of actions for the user
  let actions = actionsList?.find((action) => action.userId === userId);

  if (!actions || actions.length === 0) {
    const isGenerated = await generateActions(message, userId, currentURL);
    if (!isGenerated) {
      return res
        .status(500)
        .send("An error occurred while generating steps for your action.");
    } else {
      actions = actionsList?.find((action) => action.userId === userId);
    }
  }

  // Set the correct headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Flush headers to establish SSE connection
  res.flushHeaders();

  try {
    const chatStream = await cohere.chatStream({
      chatHistory,
      message: `Given a valid HTML DOM, generate a sequence of actions structured as JSON JavaScript object where each action corresponds to either:
        Opening a new tab and directing to a url that you the model are required to define,
        Setting the value of an input element (setValue), or
        Clicking a button (click).

        Each action object must have the following structure:
        property: The DOM attribute that will be used to identify the element (e.g., aria-label, name, id, class).
        value: The specific value of the attribute that uniquely identifies the element in the DOM.
        tag: The HTML tag of the element (e.g., input, button).
        action: Either "newTab" for navigating to the page to complete the action, "setValue" for input fields or "click" for buttons.
        url (absolutely required if action is "newTab"): describe the location to which the frontend should navigate to, ie the destination URL (e.g if sending an email, navigate to https://mail.google.com/")
        input (optional): If the action is setValue, this specifies the value to be inputted into the field.
        
        Instructions for Action Creation:
        For input fields:
        Only include <input> elements that have the attributes aria-label, name, id, or placeholder.
        The action should be "setValue".
        The input field must contain the text to be entered into the input field (e.g., "CPEN 331").

        For buttons:
        Only include <button> elements that have the attributes aria-label, name, id, or class.
        The action should be "click".

        Expected Output Format:
        The result should be a JSON Object, where each entry is an object structured like this (please note that the everything except the value of the "action" key are subject to change based on the context of the task):
        [
          {
            action: "newTab",
            url: "https://mail.google.com/",
          },
          {
            property: "aria-label",
            value: "Search mail",
            tag: "input",
            action: "setValue",
            input: "CPEN 331",
          },
          {
            property: "aria-label",
            value: "Search mail",
            tag: "button",
            action: "click",
          },
        ]

      Broswer Action: ${actions.actions.shift()}    
      HTML DOM: ${htmlDOM}
      `,
      connectors: [{ id: "web-search" }],
    });

    let aiResponse = "";

    // Stream the response to the client
    for await (const data of chatStream) {
      if (data.eventType === "text-generation") {
        res.write(data.text);
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
