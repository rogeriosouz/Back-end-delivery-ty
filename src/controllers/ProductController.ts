import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prismaClient/prismaClient';

class ProductController {
  async read(_: Request, res: Response) {
    try {
      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          Category: true,
          productUrl: true,
          createdAt: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(200).json(products);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ Error: 'error intenal servidor' });
    }
  }

  async create(req: Request, res: Response) {
    const { name, description, category, price, quant } = req.body;

    const urlProducts = `http://localhost:3333/files/${req.file?.filename}`;

    try {
      const schema = z.object({
        name: z.string(),
        price: z.number(),
        quant: z.number(),
        description: z.string().min(3).max(300),
      });

      const isCategory = await prisma.category.findMany({
        where: { name: category },
      });

      const isProduct = await prisma.product.findFirst({ where: { name } });

      if (!isCategory) {
        return res.status(401).json({ Error: 'error dados invalidos' });
      }

      if (isProduct) {
        return res.status(401).json({ Error: 'error dados invalidos' });
      }

      if (
        !schema.parse({
          name,
          price: Number(price),
          description,
          quant: Number(quant),
        })
      ) {
        return res.status(401).json({ Error: 'error dados invalidos' });
      }

      const product = await prisma.product.create({
        data: {
          name,
          price: Number(price),
          productUrl: urlProducts,
          description,
          categoryId: isCategory[0].id,
          quant: Number(quant),
        },
      });

      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ Error: 'error intenal servidor' });
    }
  }

  async readOne(req: Request, res: Response) {
    const { id: productId } = req.params;
    if (!productId) {
      return res.status(404).json({ error: 'Error data invalido' });
    }

    try {
      const product = await prisma.product.findUnique({
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          Category: true,
          productUrl: true,
          createdAt: true,
        },
        where: {
          id: productId,
        },
      });

      return res.status(200).json(product);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: 'Error internal servidor' });
    }
  }

  async updateQuantProduct(req: Request, res: Response) {
    const { quant } = req.body;
    const { id } = req.params;

    try {
      const schema = z.object({
        quant: z.number(),
      });

      if (!schema.parse({ quant })) {
        return res.status(401).json({ Error: 'error dados invalidos' });
      }

      const newProduct = await prisma.product.update({
        where: {
          id,
        },
        data: {
          quant,
        },
      });

      return res.status(200).json(newProduct);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: 'Error internal servidor' });
    }
  }

  async update(req: Request, res: Response) {
    const { name, description, category, price } = req.body;
    const { id } = req.params;
    const urlProducts = `http://localhost:3333/files/${req.file?.filename}`;

    try {
      const schema = z.object({
        name: z.string(),
        description: z.string(),
        category: z.string(),
        price: z.number(),
      });

      const isCategory = await prisma.category.findMany({
        where: { name: category },
      });

      const isProduct = await prisma.product.findFirst({ where: { name } });

      if (!isCategory) {
        return res.status(401).json({ Error: 'error dados invalidos' });
      }

      if (isProduct) {
        return res.status(401).json({ Error: 'error dados invalidos' });
      }

      if (!schema.parse({ name, description, category, price })) {
        return res.status(401).json({ Error: 'error dados invalidos' });
      }

      const newProduct = await prisma.product.update({
        where: {
          id,
        },
        data: {
          name,
          price,
          description,
          productUrl: urlProducts,
          categoryId: isCategory[0].id,
        },
      });

      return res.status(200).json(newProduct);
    } catch (error) {
      console.log(error);
      return res.status(404).json({ error: 'Error internal servidor' });
    }
  }
}

export default new ProductController();
