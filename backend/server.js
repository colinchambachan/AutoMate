const express = require("express");
const { CohereClient } = require("cohere-ai");

// Import the API key from the .env file
require("dotenv").config();
const apiKey = process.env.COHERE_API_KEY;

const cohere = new CohereClient({
  token: apiKey,
});

const app = express();
app.use(express.json({ limit: "50mb" }));

// let chatHistory = [];

// {user: number, actions: [string]} (NOTE ACTIONS IS A LIST OF STRINGS)
// let actionsList = [];

// /**
//  * Generate the list of actions in JSON format you need to perform to acheive this final result
//  * returns true if the action is generated successfully
//  *
//  * @param {string} message
//  * @param {number} userId
//  * @param {string} currentURL
//  * @returns {boolean}
//  */
// async function generateActions(message, userId, currentURL) {
//   try {
//     const response = await cohere.chat({
//       message: `Generate a detailed, list of actions, formatted as an array of strings in JSON (NOT IN MARKDOWN), that need to be performed in a browser to achieve the following final result.
// Each action should be a simple string describing what to do. The final array should look like: ["action1", "action2", ..., "DONE"]. Note that the final action MUST be "DONE".
// For example, if the final result is to send an email, the actions might be ["Open Gmail", "Click Compose Button", "Fill in recipient", "Fill in subject", "Fill in body", "Click Send", "DONE"].
// Final result: ${message}
// Current page URL: ${currentURL}`,
//     });

//     console.log("response", response.text);
//     actionsList.push({
//       userId,
//       actions: JSON.parse(response.text),
//       finalResult: message,
//     });
//     console.log("actionList", actionsList);
//     return true;
//   } catch (error) {
//     console.error("Error:", error);
//     return false;
//   }
// }

app.post("/chat", async (req, res) => {
  const { message, userId, htmlDOM, currentURL } = req.body;

  if (!message || !userId || !htmlDOM || !currentURL) {
    return res.status(400).send("Missing required parameters");
  }

  // // Get the list of actions for the user
  // let actions = actionsList?.find((action) => action.userId === userId);

  // if (!actions) {
  //   const isGenerated = await generateActions(message, userId, currentURL);
  //   if (!isGenerated) {
  //     return res
  //       .status(500)
  //       .send("An error occurred while generating steps for your action.");
  //   } else {
  //     actions = actionsList?.find((action) => action.userId === userId);
  //   }
  // }

  // Set the correct headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Flush headers to establish SSE connection
  // res.flushHeaders();

  try {
    const chatStream = await cohere.chatStream({
      // chatHistory,
      message: `Given a valid HTML DOM, generate a sequence of actions/action structured as a JSON object:
        DO NOT OUTPUT \`\`\`json OR ANY MARKDOWN, JUST THE JSON OBJECT.
        Note that you can't not access the browser directly. You can only interact with the webpage through the DOM.
        If you are on the correct webpage, you can start with setValue or click actions.
        If you think you are done, you can end the sequence with a "DONE" in pure string.
        Note that you will have access to the HTML DOM of the current page you are on.
        You will have multiple iterations to complete the task, SO DO NOT DO ALL OPERATIONS AT ONCE.

        There exists three types of actions: newTab, setValue, and click.

        newTab: Navigates to a new tab with the specified URL.
          - field: url

        setValue: Sets the value of an input field to the specified value.
          - fields: property, value, tag, action, input 
        
        click: Clicks a button or element.
          - fields: property, value, tag, action
        
        property: The DOM attribute that will be used to identify the element (e.g., aria-label, name, id, class).
        value: The specific value of the attribute that uniquely identifies the element in the DOM.
        tag: The HTML tag of the element (e.g., input, button, textarea ...).
        action: "newTab"/"setValue"/"click"
        url: describe the location to which the frontend should navigate to
        input: If the action is setValue, this specifies the value to be inputted into the field.
        
        Instructions for Action Creation:
        For input fields:
        Only include <input> elements that have the attributes aria-label, name, id, or placeholder.
        The action should be "setValue".
        The input field must contain the text to be entered into the input field (e.g., "CPEN 331").

        For buttons:
        Only include <button> elements that have the attributes aria-label, name, id, or class.
        The action should be "click".

        Examples:
        KEEP IN MIND THAT THESE ARE JUST EXAMPLES, SIMPLY FOLLOW THE SCHEMAS BUT CHANGE THE VALUES TO MATCH THE CURRENT DOM INPUT AND TASK. 
        
        DO NOT HALLUCINATE, MAKE SURE THE JSON ARE CORRECTLY FORMATTED.

    Search CPEN 331 in my email inbox:
iteration 1
[
    {
      "action": "newTab",
      "url": "https://mail.google.com/"
    }
]
iteration 2
[
    {
      "property": "aria-label",
      "value": "Search mail",
      "tag": "input",
      "input": "CPEN 331",
      "action": "setValue"
    },
    {
      "property": "aria-label",
      "value": "Search mail",
      "tag": "button",
      "action": "click"
    }
]
    Write an email to a friend:
iteration 1
[
    {
      "action": "newTab",
      "url": "https://mail.google.com/"
    }
]
iteration 2
[
    {
      "property": "class",
      "value": "T-I T-I-KE L3",
      "tag": "div",
      "action": "click"
    }
]
iteration 3
[
      {
        "property": "aria-label",
        "value": "To recipient",
        "tag": "input",
        "input": "friend@gmail.com"
      },
      {
        "property": "aria-label",
        "value": "Subject",
        "tag": "input",
        "input": "Hello!"
      },
      {
        "property": "aria-label",
        "value": "Message body",
        "tag": "div",
        "input": "Hi friend, how are you?"
]
iteration 4
[
      {
        "property": "aria-label",
        "value": "Send ‪(Ctrl-Enter)‬",
        "tag": "div",
        "action": "click"
      }
]
    
    FOR GOOGLE SEARCH
iteration 1
[
    {
        "property": "aria-label",
        "value": "Search",
        "tag": "input",
        "input": "News today",
        "action": "setValue"
    }
]

    FOR YOUTUBE SEARCHES (for song "Never gonna give you up")
iteration 1
[
    {
        "action": "newTab",
        "url": "https://www.youtube.com/"
    }
]
iteration 2
[
    {
        "property": "aria-label",
        "value": "Search",
        "tag": "input",
        "input": "Never gonna give you up",
        "action": "setValue"
    }, 
    {
        "property": "aria-label",
        "value": "Search",
        "tag": "button",
        "action": "click"
    }
]
iteration 3
[
    {
        "property": "class",
        "value": "style-scope ytd-item-section-renderer",
        "tag": "div",
        "action": "click"
    }
]

    FOR GOOGLE NEWS SEARCHES
iteration 1
[
    {
        "action": "newTab",
        "url": "https://www.news.google.com/"
    }
]
iteration 2
[
    {
        "property": "aria-label",
        "value": "Search",
        "tag": "input",
        "input": "Mark Zuckerberg",
        "action": "setValue"
    },
    {
        "property": "aria-label",
        "value": "Search",
        "tag": "button",
        "action": "click"
    }
]

      If you see an instruction that is similar to one of the above, you may ignore the DOM input and use the example instead.
   
      Broswer Action: ${message}    
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
    // chatHistory.push({ role: "USER", message });
    // chatHistory.push({ role: "CHATBOT", message: aiResponse });
    // console.log("chatHistory", chatHistory);
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
