chrome.runtime.onInstalled.addListener(() => {
  console.log("BG Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received from popup:", request);

  if (request.action === "testFunctionality") {
    console.log("Executing test functionality");

    chrome.tabs.query({}, function (tabs) {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, { action: "extensionInstalled" });
      });
    });

    // Send a response back to the popup
    sendResponse({ status: "Functionality tested." });
  } else if (request.action === "performAction") {
    // Toggle mute functionality

    if (request.perform.action === "newTab") {
      // chrome.tabs.create({ url: request.perform.url });
      console.log("Creating new tab");
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        chrome.tabs.update(currentTab.id, { url: request.perform.url });
      });
    } else {
      console.log("Interacting with element");
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0]; // there will be only one in this array
        console.log("Current tabs:", tabs);
        console.log("Request:", request);
        const payload = {
          action: "interactElement",
          request,
        };
        console.log("Sending payload:", payload);
        chrome.tabs.sendMessage(currentTab.id, payload);
      });
    }
  }

  // Return true to indicate you want to send an asynchronous response
  return true;
});
