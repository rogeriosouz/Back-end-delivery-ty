import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

const ferifica = async (req: any, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(402).json({ Errors: 'Token nao enviado!' });
  }

  jwt.verify(
    token as string,
    process.env.SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ Errors: 'Token invalido!' });
      }
      req.userId = decoded.userId;
      next();
    }
  );
};

export default ferifica;
