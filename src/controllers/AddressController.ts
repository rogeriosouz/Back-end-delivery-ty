import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prismaClient/prismaClient';

class AddressController {
  async read(req: Request, res: Response) {
    const { userId } = req as any;

    try {
      if (!userId) {
        return res.status(404).json({ error: 'Error data invalido' });
      }

      const address = await prisma.address.findMany({
        where: {
          userId,
        },
      });
      return res.status(200).json(address);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Error internal servidor' });
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
        return res.status(404).json({ error: 'Dada invalido' });
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
      return res.status(501).json({ error: 'Error internal servidor' });
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
        return res.status(404).json({ error: 'Dada invalido' });
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
      return res.status(501).json({ error: 'Error internal servidor' });
    }
  }

  async readOne(req: Request, res: Response) {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ error: 'params nao informado' });
      }

      const address = await prisma.address.findFirst({
        where: {
          id,
        },
      });

      return res.status(200).json(address);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Error internal servidor' });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      if (!id) {
        return res.status(400).json({ error: 'params nao informado' });
      }

      const address = await prisma.address.delete({
        where: {
          id,
        },
      });

      return res.status(200).json(address);
    } catch (error) {
      console.log(error);
      return res.status(501).json({ error: 'Error internal servidor' });
    }
  }
}

export default new AddressController();
