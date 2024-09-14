// // src/background.js
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'testFunctionality') {
//     console.log("Message received from popup.");

//     // Option 1: Open a new tab
//     chrome.tabs.create({ url: 'https://www.example.com' }, () => {
//       console.log("New tab opened.");
//     });

//     // Option 2: Send a message to the content script
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const activeTab = tabs[0].id;
//       chrome.scripting.executeScript({
//         target: { tabId: activeTab },
//         func: () => {
//           alert('Content Script Test: This alert is from the content script!');
//         }
//       });
//     });

//     // Send a response back to the popup
//     sendResponse({ status: "Functionality tested." });
//   }
//   return true; // Keeps the message channel open for async responses
// });

chrome.runtime.onInstalled.addListener(() => {
  console.log("Installed");
});
