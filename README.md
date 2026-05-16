# Loan Management System (LMS) - Full Stack Assignment

A complete lending platform where borrowers apply for loans and internal executives manage the loan lifecycle. Built according to the exact specifications of the CreditSea assignment.

## 🛠️ Tech Stack
*   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI
*   **Backend**: Node.js, Express.js, TypeScript
*   **Database**: MongoDB, Mongoose
*   **Authentication**: JWT, bcrypt

---

## ✨ Features & JD Implementation
*   **Role-Based Access Control (RBAC)**: Distinct dashboards and API restrictions for Admin, Sales, Sanction, Disbursement, Collection, and Borrower.
*   **Business Rule Engine (BRE)**: Strict server-side validation rejecting applications if: Age < 23 or > 50, Salary < ₹25,000, PAN is invalid (Regex validation), or Employment is Unemployed.
*   **Multi-Step Borrower Portal**: Smooth UX for borrowers to submit personal details, upload documents via Multer, and configure loan amounts with a dynamic Simple Interest (12% p.a.) calculator.
*   **End-to-End Operations Lifecycle**: Dashboard workflows for PENDING -> APPROVED -> DISBURSED -> CLOSED.

---

## 🚀 How to Run Locally

### Prerequisites
*   Node.js (v18+)
*   MongoDB running locally on port 27017

### Step 1: Backend Setup
1. Open a terminal and navigate to the `backend` folder.
2. Run `npm install` to install dependencies.
3. Create a `.env` file from the example (`cp .env.example .env`).
4. Run the seed script: `npm run seed` (This creates the test accounts for all roles).
5. Start the backend: `npm run dev` (Runs on http://localhost:5000).

### Step 2: Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder.
2. Run `npm install` to install dependencies.
3. Start the frontend: `npm run dev` (Runs on http://localhost:3000).
4. Access the application in your browser at **http://localhost:3000**.

---

## 🔑 Test Credentials (Pre-seeded)

The `npm run seed` command automatically populates these accounts. The password for **all** accounts is `password123`.

| Role | Email | Module Access & Testing Workflow |
| :--- | :--- | :--- |
| **Borrower** | `borrower@creditsea.com` | Login here first. Fill the multi-step form to trigger the BRE. Once applied, track loan status here. |
| **Sales** | `sales@creditsea.com` | View registered users who haven't applied for a loan yet. |
| **Sanction** | `sanction@creditsea.com` | View pending loans. Approve them or reject them (requires rejection reason). |
| **Disbursement** | `disbursement@creditsea.com` | View approved loans. Click "Release Funds" to mark them as DISBURSED. |
| **Collection** | `collection@creditsea.com` | Record borrower payments (requires unique UTR). Automatically marks loan as CLOSED when fully paid. |
| **Admin** | `admin@creditsea.com` | Has super-access to view all 4 operational modules on the dashboard. |

---

## 🧪 Testing the Complete Flow (Evaluator Guide)
1. **Borrower Applies**: Log in as `borrower@creditsea.com`. Try failing the BRE (e.g. Salary 20k), then pass it (Salary 50k) and apply for a loan.
2. **Sales Check**: (Optional) Log in as `sales@creditsea.com` to see lead tracking.
3. **Sanction Approval**: Log in as `sanction@creditsea.com` and approve the pending loan application.
4. **Disburse Funds**: Log in as `disbursement@creditsea.com` and disburse the approved loan.
5. **Collection & Closure**: Log in as `collection@creditsea.com`, select the active loan, and record a payment equal to the total repayment amount to auto-close the loan.
