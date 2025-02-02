import { Plan, User } from "@prisma/client";
import { db } from "../configs/prisma";

export class PlanRepository {
  async create(plan: Plan) {
    return await db.plan.create({ data: plan });
  }

  async update(plan: Plan) {
    return await db.plan.update({
      data: plan,
      where: {
        id: plan.id,
      },
    });
  }

  async findAll() {
    return await db.plan.findMany();
  }

  async findById(id: string) {
    return await db.plan.findUnique({ where: { id } });
  }
}
