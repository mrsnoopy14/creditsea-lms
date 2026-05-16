import jwt from 'jsonwebtoken';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey_lms_assignment_2026', {
    expiresIn: '30d',
  });
};

export default generateToken;
