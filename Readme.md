# Jira FAB Branch Copier (Chrome Extension)

**Jira FAB Branch Copier** is a lightweight Chrome extension that automatically extracts the `FAB-XXXXXX` ticket number from the currently opened Jira page and copies a ready-to-use Git branch command to your clipboard.

It works with both GitHub CLI (`gco`) and plain Git (`git checkout -b`), based on your configuration.

---

## ⭐ Features

- Detects the Jira ticket ID (`FAB-12345`) from the page URL or content  
- Copies a Git branch creation command in one click  
- Supports both:
  - `gco -b feature/FAB-XXXXXX` (GitHub CLI)
  - `git checkout -b feature/FAB-XXXXXX` (standard Git)
- Optional in-page custom keyboard shortcut  
- Visual toast notification confirms success or errors  
- Works with Jira Cloud, Jira Enterprise, and custom domains  
- Zero permissions beyond what’s required for clipboard and injection  

---

## 📦 Installation

1. Download or clone this repository.
2. Open Chrome and visit:

   ```
   chrome://extensions
   ```
3. Enable **Developer Mode** (top right).
4. Click **Load unpacked**.
5. Select the folder containing this extension.

Chrome will load it immediately.

---

## ⚙️ Configuration

Open the extension’s options page:

```
chrome://extensions → Jira FAB Branch Copier → Details → Extension options
```

You can configure:

### **1. GH CLI Installed?**
Choose:

- **Yes** → Uses  
  `gco -b feature/FAB-XXXXXX`
- **No** → Uses  
  `git checkout -b feature/FAB-XXXXXX`

### **2. Git Remote Name (Host)**
Currently stored for future features — not used in the command yet.

### **3. Custom Shortcut**
Create your own in-page shortcut such as:

```
Alt + Shift + J
Ctrl + K
Command + Shift + B
```

You can also configure Chrome-level shortcuts at:

```
chrome://extensions/shortcuts
```

---

## 🚀 Usage

On any Jira ticket page containing **FAB-xxxxxx**:

### **Option A — Click the extension icon**
The extension will:

1. Detect the ticket ID  
2. Copy the branch command to your clipboard  
3. Show a toast notification

### **Option B — Use your custom shortcut**
Press your configured key combination anywhere on the page.

### **Option C — Chrome command shortcut**
Use the OS-level shortcut defined in:

```
chrome://extensions/shortcuts
```

---

## 🔍 Example Output

If you are on:

```
https://mycompany.atlassian.net/browse/FAB-12345
```

The extension copies:

```
gco -b feature/FAB-12345
```

or

```
git checkout -b feature/FAB-12345
```

(depending on your configuration).

---

## 🛠 Troubleshooting

- **No toast appears?**  
  Refresh the Jira page after installing or updating the extension.

- **Shortcut doesn’t fire?**  
  Ensure:
  - You pressed a full combo (not just a modifier key)
  - You saved your shortcut in the options page
  - You aren't typing in an input/textarea at the time

---

## 📄 License

MIT — use freely.
