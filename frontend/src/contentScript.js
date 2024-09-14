chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extensionInstalled") {
    console.log("Extension Installed message received in content script");
    // Perform actions based on this event in the content script context
  }

  return true;
});
