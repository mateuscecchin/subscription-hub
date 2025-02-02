import { User } from "@prisma/client";
import { db } from "../configs/prisma";

export class UserRepository {
  async create(user: User) {
    return await db.user.create({ data: user  });
  }

  async update(user: Partial<User>) {
    return await db.user.update({
      data: user,
      where: {
        id: user.id,
      },
    });
  }

  async findAll() {
    return await db.user.findMany();
  }

  async findByEmail(email: string) {
    return await db.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return await db.user.findUnique({ where: { id } });
  }

  async delete(id: string) {
    return await db.user.delete({ where: { id } });
  }
}
