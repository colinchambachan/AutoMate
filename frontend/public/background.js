chrome.runtime.onInstalled.addListener(() => {
  console.log("Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received from popup.");
});
