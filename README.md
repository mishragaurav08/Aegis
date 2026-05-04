# Aegis Risk Studio: Security Risk Management & Assessment Platform

## Project Overview
Aegis Risk Studio is a comprehensive security management tool developed for quantitative risk assessment and asset tracking. The platform aligns with NIST risk management frameworks to provide stakeholders with a clear, data-driven overview of their security posture. It translates technical vulnerabilities into prioritized risk scores, enabling informed decision-making and efficient mitigation planning.

---

## Academic Information
*   **Subject:** 21CSC308T Security Risk Management Principles
*   **Faculty:** Dr. Rajalakshmi A
*   **Institution:** SRM Institute of Science and Technology
*   **Team Members:** 
    *   Gaurav Mishra [RA2311030010001]
    *   Rashmika Das [RA2311030010239]

---

## Core Functionalities

### 1. Security Dashboard
A centralized command center providing real-time visualization of risk metrics. It utilizes dynamic data modules to display asset counts, threat severity distributions, and overall system health.

### 2. Asset Inventory Management
A robust management system for tracking critical infrastructure including servers, databases, workstations, and applications. Features include cost assessment, ownership assignment, and operational status tracking.

### 3. Quantitative Risk Assessment
An automated scoring engine that calculates risk levels based on Likelihood and Impact matrices (1-5 scale). This ensures objective prioritization of security weaknesses and technical vulnerabilities.

### 4. Automated Executive Reporting
A specialized reporting engine that generates high-fidelity, single-page PDF summaries. These reports are designed for executive review, highlighting critical threats and recommended action plans.

---

## Technical Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (v18+), Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | Better-SQLite3 |
| **Reporting Engine** | PDFKit |
| **Data Visualization** | Chart.js |

---

## Installation and Local Execution

To run the Aegis Risk Studio locally, you must initialize both the backend and frontend services in parallel.

### Prerequisites
*   Node.js (v16.0 or higher)
*   npm (Node Package Manager)

### Step 1: Repository Initialization
```bash
git clone https://github.com/mishragaurav08/SRMP.git
cd SRMP
```

### Step 2: Backend Service Configuration
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Initialize the server:
   ```bash
   node server.js
   ```
   *The backend service will be active at http://localhost:5050*

### Step 3: Frontend Interface Deployment
1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Initialize the development environment:
   ```bash
   npm run dev
   ```
   *The application interface will be accessible at http://localhost:5173*

---

## Operational Workflow
1. **Asset Registration:** Navigate to the "Manage Systems" section to populate the inventory.
2. **Threat Mapping:** Use the "Risk Assessment" tool to identify vulnerabilities and assign severity scores.
3. **Data Analysis:** Review the "Security Overview" dashboard for real-time risk intelligence.
4. **Reporting:** Execute the "Download Report" function to generate the final security snapshot.
