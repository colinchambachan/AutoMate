chrome.runtime.onInstalled.addListener(() => {
  console.log("Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received from popup:", request);

  if (request.action === "testFunctionality") {
    console.log("Executing test functionality");

    // Send a response back to the popup
    sendResponse({ status: "Functionality tested." });
  }

  // Return true to indicate you want to send an asynchronous response
  return true;
});
