import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware';
import { Role } from '../models/User';
import {
  getSalesLeads,
  getPendingLoans,
  sanctionLoan,
  getApprovedLoans,
  disburseLoan,
  getDisbursedLoans,
  addPayment,
} from '../controllers/adminController';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Sales Module
router.get('/sales/leads', authorize(Role.SALES), getSalesLeads);

// Sanction Module
router.get('/sanction/loans', authorize(Role.SANCTION), getPendingLoans);
router.patch('/sanction/loans/:id', authorize(Role.SANCTION), sanctionLoan);

// Disbursement Module
router.get('/disbursement/loans', authorize(Role.DISBURSEMENT), getApprovedLoans);
router.patch('/disbursement/loans/:id', authorize(Role.DISBURSEMENT), disburseLoan);

// Collection Module
router.get('/collection/loans', authorize(Role.COLLECTION), getDisbursedLoans);
router.post('/collection/payments/:id', authorize(Role.COLLECTION), addPayment);

export default router;
