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
      const isOrderAlreadyExisting = await prisma.order.findMany();
      if (isOrderAlreadyExisting) {
        return res.status(200).json({ orders: isOrderAlreadyExisting });
      }
      res.status(400).json({ error: "No orders found" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  } else {
    res.status(405).end();
  }
}
