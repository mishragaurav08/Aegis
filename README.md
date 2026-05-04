# Aegis Risk Studio
**Enterprise Security Risk Management & Audit Framework**

---

## 1. Project Information
* **Subject:** 21CSC308T Security Risk Management Principles
* **Faculty:** Dr. Rajalakshmi A
* **Institution:** SRM Institute of Science and Technology
* **Development Team:**
    * Gaurav Mishra [RA2311030010001]
    * Rashmika Das [RA2311030010239]

---

## 2. Executive Summary
Aegis Risk Studio is a specialized cybersecurity framework designed to streamline the lifecycle of security risk management. The platform provides a unified interface for system identification, quantitative risk analysis, treatment planning, and continuous audit monitoring. It is built to meet the rigorous standards of modern security frameworks while maintaining a focus on user-centric design and data integrity.

---

## 3. Core Modules

### 3.1 Asset Inventory & Criticality Scoping
The platform enables comprehensive identification of organizational assets. Each system is evaluated through a **CIA Triad** (Confidentiality, Integrity, and Availability) scoring system, allowing for the determination of asset criticality and prioritization during the risk assessment phase.

### 3.2 Risk Analysis & Treatment Engine
Aegis utilizes a quantitative risk engine based on a **Likelihood vs. Impact** matrix. For every identified threat, the system facilitates the assignment of a **Risk Treatment Strategy**:
* **Mitigate:** Apply security controls to reduce risk.
* **Accept:** Formally acknowledge the risk as part of business operations.
* **Transfer:** Delegate risk to third parties or insurance.
* **Avoid:** Decommission the asset or process to eliminate the threat.

### 3.3 Activity History & Audit Evidence
To satisfy regulatory requirements, the platform maintains a verified digital evidence trail. Every creation, update, or deletion is timestamped and logged with specific details, serving as a "Direct Evidence" source for internal and external auditors.

### 3.4 Automated Reporting
The integrated report engine generates high-fidelity PDF summaries. These reports consolidate the security posture, identified exposures, and audit trails into an executive-ready format for stakeholder review.

---

## 4. Syllabus Compliance Matrix

| Syllabus Unit | Concept Implemented | Module Reference |
| :--- | :--- | :--- |
| **Unit 1** | Security Risk Management Basics | Executive Dashboard & Infrastructure |
| **Unit 2** | Asset Scoping & CIA Assessment | Manage Systems (Asset Criticality) |
| **Unit 3** | Risk Analysis & Treatment | Threat Assessment (Treatment Strategies) |
| **Unit 4** | Risk Implementation & Monitoring | System Activity (Activity History) |
| **Unit 5** | Security Audit & Recommendations | Audit Center (Safety Suggestions) |

---

## 5. Technical Infrastructure
* **Frontend:** React.js 19 with Tailwind CSS 4.0
* **Backend:** Node.js / Express
* **Database:** Local SQLite3 (Better-SQLite3)
* **Documentation:** PDFKit Engine
* **Protocol:** RESTful API Architecture

---

## 6. Installation and Deployment

### 6.1 Backend Configuration
```bash
cd backend
npm install
node server.js
```
*Service active at: http://localhost:5050*

### 6.2 Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```
*Service active at: http://localhost:5173*

---

## 7. Operational Guidelines
1. **Define Assets:** Start by registering systems and assigning CIA ratings.
2. **Evaluate Risks:** Map threats to specific assets and assign a treatment strategy.
3. **Monitor Activity:** Review the Activity History daily for evidence tracking.
4. **Export Findings:** Generate the PDF report for formal audit submissions.
