import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User, { Role } from './models/User';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lms_assignment');

    await User.deleteMany(); // Clear existing users to prevent duplicates

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      { email: 'admin@creditsea.com', password: hashedPassword, role: Role.ADMIN },
      { email: 'sales@creditsea.com', password: hashedPassword, role: Role.SALES },
      { email: 'sanction@creditsea.com', password: hashedPassword, role: Role.SANCTION },
      { email: 'disbursement@creditsea.com', password: hashedPassword, role: Role.DISBURSEMENT },
      { email: 'collection@creditsea.com', password: hashedPassword, role: Role.COLLECTION },
      { email: 'borrower@creditsea.com', password: hashedPassword, role: Role.BORROWER },
    ];

    await User.insertMany(users);

    console.log('Database Seeded Successfully with all roles.');
    console.log('All passwords are set to: password123');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${(error as Error).message}`);
    process.exit(1);
  }
};

seedUsers();
