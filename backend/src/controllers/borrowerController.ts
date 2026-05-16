import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import BorrowerProfile from '../models/BorrowerProfile';
import Loan, { LoanStatus } from '../models/Loan';

export const saveProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fullName, pan, dob, monthlySalary, employmentMode } = req.body;
    const userId = req.user?._id;

    let profile = await BorrowerProfile.findOne({ userId });

    if (profile) {
      profile.fullName = fullName;
      profile.pan = pan;
      profile.dob = dob;
      profile.monthlySalary = monthlySalary;
      profile.employmentMode = employmentMode;
      const updatedProfile = await profile.save();
      res.json(updatedProfile);
    } else {
      const newProfile = await BorrowerProfile.create({
        userId,
        fullName,
        pan,
        dob,
        monthlySalary,
        employmentMode,
      });
      res.status(201).json(newProfile);
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const uploadSalarySlip = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const userId = req.user?._id;
    let profile = await BorrowerProfile.findOne({ userId });

    if (!profile) {
      res.status(404).json({ message: 'Profile not found. Please complete step 2 first.' });
      return;
    }

    profile.salarySlipUrl = `/uploads/${req.file.filename}`;
    await profile.save();

    res.json({ message: 'File uploaded successfully', url: profile.salarySlipUrl });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const applyLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, tenure } = req.body;
    const userId = req.user?._id;

    if (amount < 50000 || amount > 500000) {
      res.status(400).json({ message: 'Loan amount must be between ₹50,000 and ₹5,00,000' });
      return;
    }

    if (tenure < 30 || tenure > 365) {
      res.status(400).json({ message: 'Tenure must be between 30 and 365 days' });
      return;
    }

    const interestRate = 12; // Fixed
    const simpleInterest = (amount * interestRate * tenure) / (365 * 100);
    const totalRepayment = amount + simpleInterest;

    const loan = await Loan.create({
      userId,
      amount,
      tenure,
      interestRate,
      totalRepayment,
      status: LoanStatus.PENDING,
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMyLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await Loan.find({ userId: req.user?._id }).sort({ createdAt: -1 });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
