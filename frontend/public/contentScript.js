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

const processAction = (data) => {
  console.log("Processing action:", data);
  if (data.action === "click") {
    findElementAndClick(data.property, data.value, data.tag);
  } else if (data.action === "setValue") {
    findElementAndSetValue(data.property, data.value, data.tag, data.input);
  }
};

// Listener function
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("i want to kermit sewer side");
  if (message.action === "extensionInstalled") {
    console.log("Extension Installed message received in content script");
  } else if (message.action === "interactElement") {
    const data = message.request.perform;
    if (data.action === "click") {
      findElementAndClick(data.property, data.value, data.tag);
    } else if (data.action === "setValue") {
      findElementAndSetValue(data.property, data.value, data.tag, data.input);
    }
  } else if (message.action === "getDOMAndURL") {
    console.log("Message received from background script:");
    const htmlDOM = document.body.innerHTML;
    const currentURL = window.location.href;
    const resp = {
      htmlDOM,
      currentURL,
    };
    sendResponse(resp);
  }

  return true;
});

/**
 *     findElementAndSetValue(
      "aria-label",
      "Search mail",
      "input",
      "setValue",
      `input: ${message.perform.input}, property ${message.perform.property}, value: ${message.perform.value},tag: ${message.perform.tag}`
    );
 * 
 */
