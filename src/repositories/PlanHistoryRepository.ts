import { PlanHistory, User } from "@prisma/client";
import { db } from "../configs/prisma";

export class PlanHistoryRepository {
  async create(planHistory:   Omit<PlanHistory, "id" | "createdAt">) {
    return await db.planHistory.create({ data: planHistory });
  }

  async update(planHistory: PlanHistory) {
    return await db.planHistory.update({
      data: planHistory,
      where: {
        id: planHistory.id,
      },
    });
  }

  async findAll() {
    return await db.planHistory.findMany();
  }

  async findById(id: string) {
    return await db.planHistory.findUnique({ where: { id } });
  }

  async findByPaymentId(paymentId:string){
    return await db.planHistory.findFirst({ where: { paymentId } });
  }

}
