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
      const { newWeight, modelName } = req.body;
      const ismodelAlreadyExisting = await prisma.stock.findFirst({
        where: {
          name: modelName,
        },
      });
      if (ismodelAlreadyExisting) {
        await prisma.stock.update({
          where: {
            name: modelName,
          },
          data: {
            leftWeight: newWeight,
          },
        });
        return res.status(200).json({ message: "Stock updated successfully" });
      }
      return res.status(404).json({ error: "Model not found" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).end();
  }
}
