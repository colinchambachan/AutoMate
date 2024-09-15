chrome.runtime.onInstalled.addListener(() => {
  console.log("BG Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received from popup:", request);

  if (request.action === "performAction") {
    // Toggle mute functionality

    if (request.perform.action === "newTab") {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        chrome.tabs.update(currentTab.id, { url: request.perform.url });
      });
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0]; // there will be only one in this array
        const payload = {
          action: "interactElement",
          request,
        };
        chrome.tabs.sendMessage(currentTab.id, payload);
      });
    }
  }

  // Return true to indicate you want to send an asynchronous response
  return true;
});
