# Aegis Risk Studio

**Subject:** 21CSC308T Security Risk Management Principles  
**Faculty:** Dr. Rajalakshmi A  

**Team Members:**  
* Gaurav Mishra [RA2311030010001]  
* Rashmika Das [RA2311030010239]  

A professional cybersecurity risk management platform designed for asset criticality assessment, threat analysis, and automated audit evidence tracking.

## Core Features

### 1. Asset Criticality Assessment
The platform implements a comprehensive asset scoping module. Users can register IT systems and assign Confidentiality, Integrity, and Availability (CIA) scores (1-5) to determine the security profile of each item.

### 2. Risk Analysis and Treatment
Systems are evaluated against specific threats using a quantitative Likelihood vs. Impact matrix. For every identified risk, the platform requires a formal Treatment Strategy (Mitigate, Accept, Transfer, or Avoid), ensuring compliance with international risk management standards.

### 3. Automated Activity History
Every modification, system registration, and risk assessment is automatically logged in the Activity History. This module provides verified digital evidence for auditors, including system-generated timestamps and unique record IDs.

### 4. Safety Suggestions and Checklist
The system includes an intelligent suggestion engine that proactively identifies critical exposures and unrecorded assets. A built-in security checklist monitors routine tasks like access reviews and data integrity checks.

### 5. Professional Reporting
The application features a built-in PDF reporting engine that generates single-page executive summaries. These reports consolidate system inventory, high-priority threats, and the verified audit trail into a professional format.

## Setup and Execution

### Prerequisites
* Node.js (v18+)
* npm (v9+)

### Installation

#### Backend Server
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
The backend will be active at http://localhost:5050.

#### Frontend Interface
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
The interface will be accessible at http://localhost:5173.

## Technical Infrastructure
* Frontend: React.js, Tailwind CSS
* Backend: Node.js, Express.js
* Database: SQLite3 (Local)
* Report Engine: PDFKit
