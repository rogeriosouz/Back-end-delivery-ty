import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prismaClient/prismaClient';

class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      const schema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      });

      const isUser = await prisma.user.findFirst({ where: { email: email } });

      if (!schema.parse({ name, email, password })) {
        return res.status(401).json({ Error: 'Error invalid data' });
      }

      if (isUser) {
        return res.status(401).json({ Error: 'Error invalid data' });
      }

      const user = await prisma.user.create({
        data: { name, email, password: bcrypt.hashSync(password, 10) },
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.SECRET as string,
        {
          expiresIn: process.env.TOKEN_DAYS,
        }
      );

      return res.status(202).json({
        token,
        user: { name: user.name, email: user.email, id: user.id },
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({ Error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const schema = z.object({
        email: z.string().email(),
        password: z.string(),
      });

      if (!schema.parse({ email, password })) {
        return res.status(401).json({ Error: 'Error invalid data' });
      }

      const user = await prisma.user.findFirst({ where: { email } });

      if (!user) {
        return res.status(401).json({ Error: 'Error invalid datas' });
      }

      const passwordBcri = bcrypt.compareSync(password, user.password);

      if (!passwordBcri) {
        return res.status(401).json({ Error: 'Error invalid data' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.SECRET as string,
        {
          expiresIn: process.env.TOKEN_DAYS,
        }
      );

      return res.status(200).json({
        token,
        user: { name: user.name, email: user.email, id: user.id },
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({ Error: 'Internal server error' });
    }
  }

  async recoveryUser(req: Request, res: Response) {
    const { userId } = req as any;

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      return res.status(200).json({
        user: {
          name: user?.name,
          email: user?.email,
          id: user?.id,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(501).json({ Error: 'Internal server error' });
    }
  }
}

export default new UserController();
