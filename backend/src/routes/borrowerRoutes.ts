import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { runBRE } from '../middlewares/breMiddleware';
import upload from '../middlewares/uploadMiddleware';
import {
  saveProfile,
  uploadSalarySlip,
  applyLoan,
  getMyLoans,
} from '../controllers/borrowerController';

const router = express.Router();

router.post('/profile', protect, runBRE, saveProfile);
router.post('/upload', protect, upload.single('salarySlip'), uploadSalarySlip);
router.post('/loan', protect, applyLoan);
router.get('/loan', protect, getMyLoans);

export default router;
