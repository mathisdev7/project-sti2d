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
      if (!session || session.user.admin === false) {
        return res.status(401).end();
      }
      const { maxWeight, modelName } = req.body;
      const ismodelAlreadyExisting = await prisma.stock.findFirst({
        where: {
          name: modelName,
        },
      });
      if (ismodelAlreadyExisting) {
        return res.status(400).json({ error: "Model already exists" });
      }
      const stockAdded = await prisma.stock.create({
        data: {
          name: modelName,
          maxWeight,
          leftWeight: maxWeight,
        },
      });
      res.status(201).json(stockAdded);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).end();
  }
}
