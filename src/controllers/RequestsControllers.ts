import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prismaClient/prismaClient';

class RequestsControllers {
  async readOne(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ error: 'Error data invalido' });
    }

    try {
      const requests = await prisma.requests.findUnique({
        include: {
          Address: true,

          products: {
            select: {
              id: true,
              name: true,
              price: true,
              productUrl: true,
              description: true,
              quant: true,
              Category: {
                select: {
                  id: true,
                  name: true,
                  createdAt: true,
                },
              },
            },
          },
        },
        where: {
          id,
        },
      });

      return res.status(200).json(requests);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Error internal servidor' });
    }
  }
  async readAll(req: Request, res: Response) {
    const { userId } = req as any;

    if (!userId) {
      return res.status(404).json({ error: 'Error data invalido' });
    }

    try {
      const requests = await prisma.requests.findMany({
        include: {
          products: true,
        },
        where: {
          userId: userId,
        },
      });

      return res.status(200).json(requests);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Error internal servidor' });
    }
  }

  async create(req: Request, res: Response) {
    const { total, shipping, Thing, typeOfPaymen, productsId, addressId } =
      req.body;
    const { userId } = req as any;

    try {
      const schema = z.object({
        total: z.number(),
        shipping: z.number(),
        Thing: z.number(),
        productsId: z
          .object({
            id: z.string(),
          })
          .array(),
        typeOfPaymen: z.string(),
        userId: z.string(),
        addressId: z.string(),
      });

      if (
        !schema.parse({
          total,
          shipping,
          Thing,
          typeOfPaymen,
          userId,
          productsId,
          addressId,
        })
      ) {
        return res.status(404).json({ error: 'Error data invalido' });
      }

      const requests = await prisma.requests.create({
        data: {
          addressId,
          total,
          shipping,
          Thing,
          typeOfPayment: typeOfPaymen,
          userId,
          products: { connect: productsId },
        },
      });

      return res.status(202).json(requests);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Error internal servidor' });
    }
  }
}

export default new RequestsControllers();
