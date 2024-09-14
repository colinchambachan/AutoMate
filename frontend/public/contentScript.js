const data = [
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
];

const findElementAndClick = (property, value, tag) => {
  let element = document.querySelector(`${tag}[${property}="${value}"]`);
  if (element) {
    element.click();
  } else {
    console.error(`Element not found: ${tag}[${property}="${value}"]`);
  }
};

const findElementAndSetValue = (property, value, tag, text) => {
  let element = document.querySelector(`${tag}[${property}="${value}"]`);
  if (element) {
    element.value = text;
  } else {
    console.error(`Element not found: ${tag}[${property}="${value}"]`);
  }
};

const processActions = (data) => {
  let x = 0;
  data.forEach((element) => {
    setTimeout(() => {
      if (element.action === "click") {
        findElementAndClick(element.property, element.value, element.tag);
      } else if (element.action === "setValue") {
        findElementAndSetValue(
          element.property,
          element.value,
          element.tag,
          element.input
        );
      }
    }, 3000 + 1000 * x); // Increment the timeout to simulate sequential actions
    x += 1;
  });
};

// Listener function
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extensionInstalled") {
    console.log("Extension Installed message received in content script");
  } else if (message.action === "testChrome") {
    // Uncommented modular approach
    processActions(data);
  } else if (message.action === "getDOMAndURL") {
    const htmlDOM = document.documentElement.innerHTML;
    const currentURL = window.location.href;
    const resp = {
      htmlDOM,
      currentURL,
    };
    sendResponse(resp);
  }

  return true;
});
