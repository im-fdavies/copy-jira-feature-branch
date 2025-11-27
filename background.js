// background.js (MV3 service worker)

// Helper: inject our content script, then send the COPY_FAB_COMMAND message
function injectAndSend(tabId, source) {
  if (!tabId) return;

  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ["contentScript.js"]
    },
    () => {
      if (chrome.runtime.lastError) {
        console.warn(
          "[FAB Copier] failed to inject contentScript from",
          source,
          ":",
          chrome.runtime.lastError.message
        );
        return;
      }

      console.log("[FAB Copier] injected contentScript from", source);

      chrome.tabs.sendMessage(tabId, { type: "COPY_FAB_COMMAND" }, () => {
        if (chrome.runtime.lastError) {
          console.warn(
            "[FAB Copier] could not send message from",
            source,
            ":",
            chrome.runtime.lastError.message
          );
        } else {
          console.log("[FAB Copier] message sent from", source);
        }
      });
    }
  );
}

// When the extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;
  injectAndSend(tab.id, "icon click");
});

// When a Chrome command is triggered (from chrome://extensions/shortcuts)
chrome.commands.onCommand.addListener((command) => {
  if (command === "_execute_action" || command === "copy_fab_command") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab || !tab.id) return;
      injectAndSend(tab.id, "keyboard command");
    });
  }
});