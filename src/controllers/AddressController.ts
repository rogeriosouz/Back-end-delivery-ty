import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prismaClient/prismaClient';

class AddressController {
  async read(req: Request, res: Response) {
    const { userId } = req as any;

    try {
      if (!userId) {
        return res.status(404).json({ error: 'Error invalid data' });
      }

      const address = await prisma.address.findMany({
        where: {
          userId,
        },
      });
      return res.status(200).json(address);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Internal server error' });
    }
  }

  async create(req: Request, res: Response) {
    const { userId } = req as any;

    const { zip_code, street, number, neighborhood, city, state, complement } =
      req.body;

    try {
      const schema = z.object({
        zip_code: z.number(),
        street: z.number(),
        number: z.number(),
        neighborhood: z.string(),
        city: z.string(),
        state: z.string(),
        complement: z.string(),
        userId: z.string(),
      });

      if (
        !schema.parse({
          zip_code,
          street,
          number,
          neighborhood,
          city,
          state,
          complement,
          userId,
        })
      ) {
        return res.status(404).json({ error: 'Error invalid data' });
      }

      const address = await prisma.address.create({
        data: {
          zip_code,
          street,
          number,
          neighborhood,
          city,
          state,
          complement,
          userId,
        },
      });

      return res.status(202).json(address);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response) {
    const { id: addressId } = req.params;

    const { zip_code, street, number, neighborhood, city, state, complement } =
      req.body;

    try {
      const schema = z.object({
        zip_code: z.number(),
        street: z.number(),
        number: z.number(),
        neighborhood: z.string(),
        city: z.string(),
        state: z.string(),
        complement: z.string(),
        addressId: z.string(),
      });

      if (
        !schema.parse({
          zip_code,
          street,
          number,
          neighborhood,
          city,
          state,
          complement,
          addressId,
        })
      ) {
        return res.status(404).json({ error: 'Error invalid data' });
      }

      const addresUpdate = await prisma.address.update({
        where: { id: addressId },
        data: {
          zip_code,
          street,
          number,
          neighborhood,
          city,
          state,
          complement,
        },
      });

      return res.status(200).json(addresUpdate);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Internal server error' });
    }
  }

  async readOne(req: Request, res: Response) {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ error: 'Parameter not informed' });
      }

      const address = await prisma.address.findFirst({
        where: {
          id,
        },
      });

      return res.status(200).json(address);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ error: 'Parameter not informed' });
      }

      const address = await prisma.address.delete({
        where: {
          id,
        },
      });

      return res.status(200).json(address);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Internal server error' });
    }
  }
}

export default new AddressController();
