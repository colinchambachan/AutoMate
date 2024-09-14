chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'startRecording') {
      chrome.scripting.executeScript({
        target: {tabId: message.tabId},
        files: ['index.html']
      });
    }
  });