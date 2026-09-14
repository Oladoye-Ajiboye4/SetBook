import bcrypt from 'bcryptjs';
import crypto from 'crypto';


export const hashPassword = async (password) => {
  const saltRounds = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};


// hashPassword('Password123')


export const compareHash = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

// comparePassword('Password123', '$2b$10$mOgmjADgLh0e06gU8EpOo.kxBiXJ2Usi9B2l6VLfpGoeKDqq.pDD6')

export const tokenHasher = async (token) => {
  const saltRounds = await bcrypt.genSalt(10);
  const hashedToken = await bcrypt.hash(token, saltRounds);
  return hashedToken;
};


export const genToken = (byte) => {
  return crypto.randomBytes(byte).toString('hex');
}