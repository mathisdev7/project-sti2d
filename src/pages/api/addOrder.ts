import { prisma } from "@/lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const session = await auth(req, res);
      if (!session) {
        return res.status(401).end();
      }
      const { weight, modelName } = req.body;
      const orderAdded = await prisma.order.create({
        data: {
          modelName: modelName,
          userId: session.user.id,
          quantity: weight,
          price: weight * 10,
        },
      });
      await prisma.stock.update({
        where: {
          name: modelName,
        },
        data: {
          leftWeight: {
            decrement: weight,
          },
        },
      });
      res.status(201).json(orderAdded);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).end();
  }
}
