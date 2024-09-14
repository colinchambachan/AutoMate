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
  } else if (request.action === "performTabAction") {
    // Toggle mute functionality
    var newURL = "http://mail.google.com/";
    chrome.tabs.create({ url: newURL });

    setTimeout(() => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0]; // there will be only one in this array
        chrome.tabs.sendMessage(currentTab.id, {
          action: "testChrome",
        });
      });
    }, 2000);
  }

  // Return true to indicate you want to send an asynchronous response
  return true;
});
