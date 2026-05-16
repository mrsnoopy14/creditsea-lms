import mongoose, { Schema, Document } from 'mongoose';

export enum EmploymentMode {
  SALARIED = 'Salaried',
  SELF_EMPLOYED = 'Self-Employed',
  UNEMPLOYED = 'Unemployed',
}

export interface IBorrowerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BorrowerProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String, required: true },
    pan: { type: String, required: true },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    employmentMode: {
      type: String,
      enum: Object.values(EmploymentMode),
      required: true,
    },
    salarySlipUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBorrowerProfile>('BorrowerProfile', BorrowerProfileSchema);
