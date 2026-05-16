# Loan Management System (LMS)

A full-stack lending platform where borrowers apply for loans and internal executives manage the loan lifecycle. Built for the CreditSea assignment.

## Tech Stack
*   **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI
*   **Backend**: Node.js, Express.js, TypeScript
*   **Database**: MongoDB, Mongoose
*   **Authentication**: JWT, bcrypt

## Features
*   **Role-Based Access Control (RBAC)**: Distinct views and API restrictions for Admin, Sales, Sanction, Disbursement, Collection, and Borrower.
*   **Business Rule Engine (BRE)**: Server-side validation for age, salary, PAN format, and employment mode.
*   **Multi-Step Application**: Smooth UX for borrowers to submit details, upload salary slips (Multer), and configure loan amounts with dynamic Simple Interest calculation.
*   **End-to-End Lifecycle**: PENDING -> APPROVED -> DISBURSED -> CLOSED.

## Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   MongoDB running locally on port 27017

### 1. Backend Setup
```bash
cd backend
npm install
# Copy .env.example to .env
cp .env.example .env
# Seed the database with predefined roles
npm run seed
# Start the backend server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start the frontend server
npm run dev
```
Access the application at `http://localhost:3000`.

## Test Credentials

The `npm run seed` command automatically populates these accounts. The password for **all** accounts is `password123`.

*   **Borrower**: `borrower@creditsea.com`
*   **Sales**: `sales@creditsea.com`
*   **Sanction**: `sanction@creditsea.com`
*   **Disbursement**: `disbursement@creditsea.com`
*   **Collection**: `collection@creditsea.com`
*   **Admin**: `admin@creditsea.com`
