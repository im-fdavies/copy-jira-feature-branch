// contentScript.js

// Prevent double-injection on the same page
if (window.__fabCopierLoaded) {
    console.log("[FAB Copier] content script already loaded, skipping init");
  } else {
    window.__fabCopierLoaded = true;
  
    console.log("[FAB Copier] content script loaded on", window.location.href);
  
    let recordedShortcut = null;
    let ghCliInstalled = false;
  
    // Load user options (shortcut, host, gh-cli flag)
    chrome.storage.sync.get(["shortcut", "ghCliInstalled", "host"], (stored) => {
      recordedShortcut = stored.shortcut || null;
  
      if (stored.ghCliInstalled === true || stored.ghCliInstalled === "yes") {
        ghCliInstalled = true;
      } else {
        ghCliInstalled = false;
      }
  
      console.log(
        "[FAB Copier] settings loaded",
        "shortcut=",
        recordedShortcut,
        "ghCliInstalled=",
        ghCliInstalled,
        "host(stored)=",
        stored.host
      );
    });
  
    // If options change while page is open, update them
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync") return;
  
      if (changes.shortcut) {
        recordedShortcut = changes.shortcut.newValue || null;
        console.log("[FAB Copier] shortcut updated:", recordedShortcut);
      }
  
      if (changes.ghCliInstalled) {
        const val = changes.ghCliInstalled.newValue;
        ghCliInstalled = val === true || val === "yes";
        console.log("[FAB Copier] ghCliInstalled updated:", ghCliInstalled);
      }
    });
  
    // Listen for messages from the background (icon click / chrome command)
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "COPY_FAB_COMMAND") {
        console.log("[FAB Copier] received COPY_FAB_COMMAND message");
        handleCopy();
      }
    });
  
    // Turn a KeyboardEvent into a canonical string like "Alt+Shift+J"
    function keyEventToShortcutString(e) {
      const parts = [];
      if (e.ctrlKey) parts.push("Ctrl");
      if (e.metaKey) parts.push("Meta");
      if (e.altKey) parts.push("Alt");
      if (e.shiftKey) parts.push("Shift");
  
      const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
      parts.push(key);
      return parts.join("+");
    }
  
    // Listen for custom recorded shortcut
    document.addEventListener("keydown", (e) => {
      if (!recordedShortcut) return;
  
      const target = e.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable;
  
      if (isTyping) return;
  
      const current = keyEventToShortcutString(e);
      if (current === recordedShortcut) {
        e.preventDefault();
        console.log("[FAB Copier] in-page shortcut pressed:", current);
        handleCopy();
      }
    });
  
    function handleCopy() {
      // Debug toast so we know it's firing at all
      showToast("FAB Copier: attempting to copy branch…");
  
      const ticket = extractTicketNumber();
  
      if (!ticket) {
        console.warn("[FAB Copier] no FAB ticket found on page");
        showToast("No FAB-XXXXXX ticket found on this page", true);
        return;
      }
  
      let cmd;
      if (ghCliInstalled) {
        cmd = `gco -b feature/${ticket}`;
      } else {
        cmd = `git checkout -b feature/${ticket}`;
      }
  
      console.log("[FAB Copier] copying command:", cmd);
  
      navigator.clipboard
        .writeText(cmd)
        .then(() => {
          showToast(`Copied ticket number: ${ticket}`);
        })
        .catch((err) => {
          console.error("Clipboard error:", err);
          showToast("Failed to copy to clipboard", true);
        });
    }
  
    function extractTicketNumber() {
      const urlMatch = window.location.href.match(/FAB-\d+/i);
      if (urlMatch) {
        return urlMatch[0].toUpperCase();
      }
  
      const bodyText = document.body ? document.body.innerText : "";
      const textMatch = bodyText.match(/FAB-\d+/i);
      if (textMatch) {
        return textMatch[0].toUpperCase();
      }
  
      return null;
    }
  
    // ---- Toast UI ----
  
    let toastTimeout = null;
  
    function showToast(message, isError = false) {
      let toast = document.getElementById("__fab_branch_toast");
  
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "__fab_branch_toast";
        toast.style.position = "fixed";
        toast.style.top = "16px";
        toast.style.right = "16px";
        toast.style.zIndex = "999999";
        toast.style.padding = "12px 16px";
        toast.style.borderRadius = "8px";
        toast.style.fontFamily =
          "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        toast.style.fontSize = "14px";
        toast.style.boxShadow = "0 2px 12px rgba(0, 0, 0, 0.25)";
        toast.style.transition = "opacity 0.2s ease";
        toast.style.opacity = "0";
        toast.style.pointerEvents = "none";
        toast.style.maxWidth = "320px";
        toast.style.wordBreak = "break-word";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");
  
        document.body.appendChild(toast);
      }
  
      toast.textContent = message;
      toast.style.backgroundColor = isError ? "#b00020" : "#1f6feb";
      toast.style.color = "#ffffff";
      toast.style.opacity = "1";
  
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
  
      toastTimeout = setTimeout(() => {
        toast.style.opacity = "0";
      }, 3000);
    }
  }