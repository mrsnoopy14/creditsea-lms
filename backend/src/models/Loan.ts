import mongoose, { Schema, Document } from 'mongoose';

export enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DISBURSED = 'DISBURSED',
  CLOSED = 'CLOSED',
}

export interface ILoan extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  tenure: number;
  interestRate: number;
  totalRepayment: number;
  status: LoanStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true }, // in days
    interestRate: { type: Number, default: 12 }, // fixed 12% p.a.
    totalRepayment: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(LoanStatus),
      default: LoanStatus.PENDING,
    },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ILoan>('Loan', LoanSchema);
