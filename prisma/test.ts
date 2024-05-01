import { prisma } from "@/lib/prismaClient";
import { hash } from "bcrypt";

async function main() {
  const hashedPassword = await hash("admin12345", 10);
  await prisma.user.delete({
    where: {
      username: "admin",
    },
  });
  const newUser = await prisma.user.create({
    data: {
      email: "admin@admin.com",
      firstName: "Admin",
      lastName: "Admin",
      username: "admin",
      admin: true,
      password: hashedPassword,
    },
  });
  console.log("New user created:", newUser);

  const allUsers = await prisma.user.findMany();
  console.log("All users:", allUsers);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
