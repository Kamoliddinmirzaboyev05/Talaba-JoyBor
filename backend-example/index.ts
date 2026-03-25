import express, { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * Google ID Token verify funksiyasi
 */
async function verifyGoogleToken(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error('Google token verification failed:', error);
    return null;
  }
}

/**
 * POST /auth/google/register
 * Body: { "token": "google_id_token" }
 */
app.post('/auth/google/register', async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token kiritilmagan' });
  }

  // 1. Google ID Tokenni tekshirish
  const payload = await verifyGoogleToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Noto\'g\'ri Google token' });
  }

  const { email, sub: googleId, given_name, family_name, picture } = payload;

  // 2. Foydalanuvchini bazadan qidirish (Pseudo-kod)
  // let user = await User.findOne({ email });
  
  // if (!user) {
  //   // Yangi foydalanuvchi yaratish
  //   user = await User.create({
  //     email,
  //     username: email?.split('@')[0], // Emailning birinchi qismini username qilish
  //     first_name: given_name,
  //     last_name: family_name,
  //     role: 'student',
  //     googleId,
  //     is_verified: true
  //   });
  // }

  // 3. O'zimizning JWT tokenimizni yaratish
  const accessToken = jwt.sign(
    { userId: googleId, email, role: 'student' },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  const refreshToken = jwt.sign(
    { userId: googleId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // 4. Ma'lumotlarni qaytarish
  return res.json({
    access: accessToken,
    refresh: refreshToken,
    user: {
      email,
      first_name: given_name,
      last_name: family_name,
      picture,
      role: 'student'
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
