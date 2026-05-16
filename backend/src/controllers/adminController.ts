import { Request, Response } from 'express';
import User, { Role } from '../models/User';
import Loan, { LoanStatus } from '../models/Loan';
import Payment from '../models/Payment';

// ================= SALES =================
// Get users who registered but haven't applied yet
export const getSalesLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const allBorrowers = await User.find({ role: Role.BORROWER }).select('-password');
    const loans = await Loan.find();
    
    const borrowersWithLoans = loans.map((loan) => loan.userId.toString());
    const leads = allBorrowers.filter((borrower) => !borrowersWithLoans.includes(borrower._id.toString()));
    
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ================= SANCTION =================
// Get pending loans
export const getPendingLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find({ status: LoanStatus.PENDING }).populate('userId', 'email');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Approve or Reject a loan
export const sanctionLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, rejectionReason } = req.body;
    const loanId = req.params.id;

    if (![LoanStatus.APPROVED, LoanStatus.REJECTED].includes(status)) {
      res.status(400).json({ message: 'Invalid status update' });
      return;
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ message: 'Loan not found' });
      return;
    }

    if (loan.status !== LoanStatus.PENDING) {
      res.status(400).json({ message: `Cannot transition from ${loan.status} to ${status}` });
      return;
    }

    loan.status = status;
    if (status === LoanStatus.REJECTED) {
      loan.rejectionReason = rejectionReason;
    }

    await loan.save();
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ================= DISBURSEMENT =================
// Get approved loans
export const getApprovedLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find({ status: LoanStatus.APPROVED }).populate('userId', 'email');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Mark as disbursed
export const disburseLoan = async (req: Request, res: Response): Promise<void> => {
  try {
    const loanId = req.params.id;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ message: 'Loan not found' });
      return;
    }

    if (loan.status !== LoanStatus.APPROVED) {
      res.status(400).json({ message: `Cannot disburse loan with status ${loan.status}` });
      return;
    }

    loan.status = LoanStatus.DISBURSED;
    await loan.save();
    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// ================= COLLECTION =================
// Get disbursed loans
export const getDisbursedLoans = async (req: Request, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find({ status: LoanStatus.DISBURSED }).populate('userId', 'email');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Add payment
export const addPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { utrNumber, amount } = req.body;
    const loanId = req.params.id as string;

    const loan = await Loan.findById(loanId);
    if (!loan) {
      res.status(404).json({ message: 'Loan not found' });
      return;
    }

    if (loan.status !== LoanStatus.DISBURSED) {
      res.status(400).json({ message: 'Can only add payments to disbursed loans' });
      return;
    }

    const existingPayment = await Payment.findOne({ utrNumber });
    if (existingPayment) {
      res.status(400).json({ message: 'UTR Number must be unique' });
      return;
    }

    const newPayment = await Payment.create({
      loanId,
      utrNumber,
      amount,
    });

    // Check if fully paid
    const allPayments = await Payment.find({ loanId });
    const totalPaid = allPayments.reduce((acc, curr) => acc + curr.amount, 0);

    if (totalPaid >= loan.totalRepayment) {
      loan.status = LoanStatus.CLOSED;
      await loan.save();
    }

    res.status(201).json({ payment: newPayment, totalPaid, loanStatus: loan.status });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
