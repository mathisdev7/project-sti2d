import { prisma } from "@/lib/prismaClient";
import { genSalt, hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "./[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await auth(req, res);
    if (!session || session.user.admin === false) {
      return res.status(401).end();
    }
    const { username, email, password, passwordRepeated, firstName, lastName } =
      req.body;
    if (password !== passwordRepeated) {
      res.status(400).json({ error: "Passwords do not match." });
      return;
    }
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
    if (user) {
      res.status(400).json({ error: "User already exists." });
      return;
    }
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        admin: false,
        email,
        username,
        password: hashedPassword,
      },
    });
    if (!newUser) {
      res.status(500).json({ error: "Failed to create user." });
      return;
    }
    res.status(201).json({ message: "User created." });
  } else {
    res.status(405).end();
  }
}
