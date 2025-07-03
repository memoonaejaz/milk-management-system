
# 🥛 Milk Management System

A simple web-based milk purchase and selling record system with daily profit reports, dark/light mode, price control, and data storage using JSON Server.

---

## 📁 Folder Structure

```
milk-management/
│
├── index.html          → Dashboard (Home)
├── buy.html            → Purchase milk
├── sell.html           → Sell milk + price control
├── report.html         → View reports with charts
│
├── css/
│   └── style.css       → Styles (dark/light theme supported)
│
├── js/
│   ├── main.js         → Dashboard logic
│   ├── buy.js          → Buying logic
│   ├── sell.js         → Selling logic + update price
│   └── report.js       → Reporting, charts, filtering
│
└── db.json             → Local database for JSON Server
```

---

## ✅ Features

- 📥 Buy milk at different rates
- 📤 Sell milk at 1 global selling price
- 💰 Admin can **view & update** selling price
- 📊 Profit calculation (income - cost)
- 📅 Filter reports by date
- ✏️ Edit/Delete records
- ⬇️ Export tables to CSV
- 🌙 Toggle Dark/Light Mode
- 📈 Live Canvas Chart in Report Page

---

## 🧰 Tools Required

| Tool          | Description                         |
|---------------|-------------------------------------|
| [VS Code](https://code.visualstudio.com/) | Code editor |
| [JSON Server](https://github.com/typicode/json-server) | Local fake REST API |
| [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) | To run HTML locally |
| Bootstrap 5   | UI framework (CDN used)             |
| Chart.js      | For graph in report page (CDN used) |

---

## 🔧 How to Install & Run

### 1. 📦 Install JSON Server (Node.js required)

```bash
npm install -g json-server
```

---

### 2. 🗂️ Place Files

Ensure you have the full folder structure as shown above.

Make sure `db.json` contains:

```json
{
  "purchases": [],
  "sales": [],
  "settings": [
    {
      "id": 1,
      "sellingPrice": 140
    }
  ]
}
```

---

### 3. 🚀 Start JSON Server

In your project folder, run:

```bash
json-server --watch db.json
```

It will give you endpoints like:

- http://localhost:3000/purchases  
- http://localhost:3000/sales  
- http://localhost:3000/settings/1 ✅

---

### 4. 🌐 Open HTML Files with Live Server

Right-click on any HTML file like `sell.html` →  
Click **“Open with Live Server”** in VS Code.

Make sure both JSON server (port `3000`) and Live Server (port `5500`) are running.

---

### 5. 🛠 If You See CORS Error

Use this Chrome extension:  
👉 [Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/occlpbilahhblgmijbkoebkblpjaejjh)

Enable it when running locally.

---

## ✨ Extra Tips

- To reset all data, just empty the `db.json` arrays.
- Use the **Export** buttons in the report page to download CSV.
- Selling price is controlled by admin in the **Sell page**.
- Reports auto-update after any transaction.

---


