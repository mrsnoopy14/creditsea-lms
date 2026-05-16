# Loan Management System (LMS)

A full-stack lending platform where borrowers apply for loans and internal executives manage the loan lifecycle. Built for the CreditSea assignment.

## 🔗 Live Links
- **Live Video Demo (3-5 min)**: [Add YouTube/Drive Video Link Here]
- **Live Application URL**: [Add Deployment Link Here (If deployed)]

---

## 🛠️ Tech Stack
*   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI
*   **Backend**: Node.js, Express.js, TypeScript
*   **Database**: MongoDB, Mongoose
*   **Authentication**: JWT, bcrypt

---

## ✨ Features
*   **Role-Based Access Control (RBAC)**: Distinct views and API restrictions for Admin, Sales, Sanction, Disbursement, Collection, and Borrower.
*   **Business Rule Engine (BRE)**: Server-side validation for age, salary, PAN format, and employment mode.
*   **Multi-Step Application**: Smooth UX for borrowers to submit details, upload salary slips (Multer), and configure loan amounts with dynamic Simple Interest calculation.
*   **End-to-End Lifecycle**: PENDING -> APPROVED -> DISBURSED -> CLOSED.

---

## 🚀 Installation & Setup Steps

### Prerequisites
*   Node.js (v18+)
*   MongoDB running locally on port 27017

### Step 1: Clone the Repository
```bash
git clone https://github.com/mrsnoopy14/creditsea-lms.git
cd creditsea-lms
```

### Step 2: Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy .env.example to .env
cp .env.example .env

# Seed the database with predefined roles
npm run seed

# Start the backend server (Runs on Port 5000)
npm run dev
```

### Step 3: Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
npm install

# Start the frontend server (Runs on Port 3000)
npm run dev
```
**Access the application at**: `http://localhost:3000`.

---

## 🔑 Test Credentials for Evaluation

The `npm run seed` command automatically populates these accounts. The password for **all** accounts is `password123`.

| Role | Email | Module Access |
| :--- | :--- | :--- |
| **Borrower** | `borrower@creditsea.com` | Multi-step loan application portal |
| **Sales** | `sales@creditsea.com` | Sales / Leads tracking |
| **Sanction** | `sanction@creditsea.com` | Sanction / Approval module |
| **Disbursement** | `disbursement@creditsea.com` | Disbursement module |
| **Collection** | `collection@creditsea.com` | Collection / Payments module |
| **Admin** | `admin@creditsea.com` | **All** dashboard modules |
