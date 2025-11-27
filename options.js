// options.js

const hostInput = document.getElementById("host");
const recordBtn = document.getElementById("recordShortcut");
const shortcutDisplay = document.getElementById("shortcutDisplay");
const saveBtn = document.getElementById("save");
const statusSpan = document.getElementById("status");

let currentShortcut = null;
let recording = false;

// Load existing settings
chrome.storage.sync.get(["shortcut", "ghCliInstalled", "host"], (stored) => {
  currentShortcut = stored.shortcut || null;
  shortcutDisplay.textContent = currentShortcut || "(none)";

  if (stored.host) {
    hostInput.value = stored.host;
  }

  // Normalize ghCliInstalled (handles both boolean and "yes"/"no")
  let ghValue = "no";
  if (stored.ghCliInstalled === true || stored.ghCliInstalled === "yes") {
    ghValue = "yes";
  }

  const radio = document.querySelector(
    `input[name="ghCliInstalled"][value="${ghValue}"]`
  );
  if (radio) radio.checked = true;
});

recordBtn.addEventListener("click", (e) => {
  e.preventDefault();
  recording = true;
  statusSpan.className = "hint";
  statusSpan.textContent = "Press your desired shortcut…";
  recordBtn.disabled = true;
  recordBtn.textContent = "Listening…";
});

// Capture shortcut when recording
document.addEventListener("keydown", (e) => {
  if (!recording) return;

  // Ignore pure modifier keys – we want the combo when a real key is pressed
  const modifierKeys = ["Shift", "Control", "Alt", "Meta"];
  if (modifierKeys.includes(e.key)) {
    // Let the user finish pressing the actual key
    return;
  }

  e.preventDefault();

  const parts = [];
  if (e.ctrlKey) parts.push("Ctrl");
  if (e.metaKey) parts.push("Meta");
  if (e.altKey) parts.push("Alt");
  if (e.shiftKey) parts.push("Shift");

  const key = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  parts.push(key);

  currentShortcut = parts.join("+");
  shortcutDisplay.textContent = currentShortcut;
  recording = false;

  recordBtn.disabled = false;
  recordBtn.textContent = "Press to record shortcut";

  statusSpan.className = "hint ok";
  statusSpan.textContent = "Shortcut recorded. Click Save to apply.";
});

// Save settings
saveBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const ghCliRadio = document.querySelector(
    'input[name="ghCliInstalled"]:checked'
  );
  const ghCliInstalled =
    ghCliRadio && ghCliRadio.value === "yes" ? true : false;

  const host = hostInput.value.trim();

  chrome.storage.sync.set(
    {
      shortcut: currentShortcut,
      ghCliInstalled,
      host
    },
    () => {
      statusSpan.className = "hint ok";
      statusSpan.textContent = "Saved!";
      setTimeout(() => {
        statusSpan.textContent = "";
        statusSpan.className = "hint";
      }, 1500);
    }
  );
});