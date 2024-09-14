    // src/contentScript.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'manipulateDOM') {
    const element = document.body;
    if (element) {
      element.style.backgroundColor = "yellow"; // Change the background color
      sendResponse({ status: "DOM Manipulated" });
    } else {
      sendResponse({ status: "Element not found" });
    }
  }
});
