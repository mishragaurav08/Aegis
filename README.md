# Aegis Risk Studio - Security Risk Management Platform

This project was developed for the **Security Risk Management Principles (21CSC308T)** course at SRM Institute of Science and Technology. It is a comprehensive tool for identifying, assessing, and reporting cyber security risks using NIST-aligned methodologies.

---

## 👥 Academic Information
*   **Subject:** 21CSC308T Security Risk Management Principles
*   **Faculty:** Dr. Rajalakshmi A
*   **Project Team:**
    *   Gaurav Mishra [RA2311030010001]
    *   Rashmika Das [RA2311030010239]

---

## 🚀 Features
*   **Risk Dashboard:** Quantitative visualization of total assets and threat distributions.
*   **Asset Management:** Track hardware, software, and network nodes with cost analysis.
*   **Quantitative Assessment:** Likelihood vs. Impact scoring (1-5 scale) to determine risk severity.
*   **Executive Reporting:** Generate a professional, single-page PDF security snapshot.
*   **Flat 3D UI:** A clean, industrial interface designed for professional security environments.

---

## ⚙️ How to Run on Local Machine

To access and use this application locally, you must run **both** the Backend and Frontend servers simultaneously.

### 📋 Prerequisites
*   **Node.js** (v16.0 or higher) installed on your machine.
*   **npm** (Node Package Manager) included with Node.js.

### Step 1: Clone the Repository
```bash
git clone https://github.com/mishragaurav08/SRMP.git
cd SRMP
```

### Step 2: Start the Backend Server (Port 5050)
The backend handles the database and report generation.
1. Open a new terminal window.
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```
   *The backend is now active at http://localhost:5050*

### Step 3: Start the Frontend Interface (Port 5173)
The frontend provides the user interface you interact with.
1. Open **another** new terminal window (keep the backend one running).
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *The interface is now active at http://localhost:5173*

---

## 📖 Access & Operation
Once both servers are running:
1. Open your browser and go to **[http://localhost:5173](http://localhost:5173)**.
2. Go to **Manage Systems** to add your infrastructure items.
3. Use **Risk Assessment** to identify threats and calculate their severity.
4. Click **Download Report** on the Dashboard to export your data as a professional PDF.

---

## 🛠️ Tech Stack
*   **Frontend:** React.js, Tailwind CSS, Chart.js
*   **Backend:** Node.js, Express.js
*   **Database:** Better-SQLite3
*   **PDF Engine:** PDFKit
