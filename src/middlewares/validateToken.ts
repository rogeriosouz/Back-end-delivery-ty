import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

const ferifica = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(402).json({ Errors: 'Token not sent' });
  }

  jwt.verify(
    token as string,
    process.env.SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ Errors: 'Invalid token' });
      }
      req.userId = decoded.userId;
      next();
    }
  );
};

export default ferifica;
