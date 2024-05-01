import { prisma } from "@/lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const session = await auth(req, res);
      if (!session) {
        return res.status(401).end();
      }
      const ismodelAlreadyExisting = await prisma.stock.findMany();
      if (ismodelAlreadyExisting) {
        return res.status(200).json({ stocks: ismodelAlreadyExisting });
      }
      res.status(400).json({ error: "No stock found" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).end();
  }
}
