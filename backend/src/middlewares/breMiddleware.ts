import { Request, Response, NextFunction } from 'express';
import { EmploymentMode } from '../models/BorrowerProfile';

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const calculateAge = (dob: Date): number => {
  const diff_ms = Date.now() - dob.getTime();
  const age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

export const runBRE = (req: Request, res: Response, next: NextFunction): void => {
  const { pan, dob, monthlySalary, employmentMode } = req.body;

  const errors: string[] = [];

  // Age Check
  if (dob) {
    const age = calculateAge(new Date(dob));
    if (age < 23 || age > 50) {
      errors.push('Age must be between 23 and 50.');
    }
  } else {
    errors.push('Date of birth is required.');
  }

  // Salary Check
  if (monthlySalary !== undefined) {
    if (Number(monthlySalary) < 25000) {
      errors.push('Monthly salary must be at least ₹25,000.');
    }
  } else {
    errors.push('Monthly salary is required.');
  }

  // PAN Check
  if (pan) {
    if (!PAN_REGEX.test(pan)) {
      errors.push('Invalid PAN format.');
    }
  } else {
    errors.push('PAN is required.');
  }

  // Employment Check
  if (employmentMode === EmploymentMode.UNEMPLOYED) {
    errors.push('Applicant cannot be Unemployed.');
  }

  if (errors.length > 0) {
    res.status(400).json({ message: 'BRE Rejected', errors });
    return;
  }

  next();
};
