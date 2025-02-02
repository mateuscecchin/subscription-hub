import { Plan } from "@prisma/client";
import { PlanRepository } from "../repositories/PlanRepository";
import { addHours } from "date-fns";

export class PlanService {
  constructor(private readonly planRepository: PlanRepository) {}
  async create(plan: Omit<Plan, "id">) {
    return await this.planRepository.create(plan as Plan);
  }

  async findAll() {
    return await this.planRepository.findAll();
  }

  async findById(id: string) {
    return await this.planRepository.findById(id);
  }
  async renewPlan(userId: string) {
    const user = await this.planRepository.findUserById(userId);
  
    if (!user || !user.planId) {
      throw new Error("Usuário não possui um plano ativo.");
    }
  
    const plan = await this.planRepository.findById(user.planId);
  
    if (!plan) {
      throw new Error("Plano não encontrado.");
    }
  
    // Estendendo a assinatura a partir da data atual ou da data de vencimento atual
    const now = new Date();
    const newStartAt = user.planEndAt && user.planEndAt > now ? user.planEndAt : now;
    const newEndAt = addHours(newStartAt, plan.durationInHours);
  
    await this.planRepository.updateUserPlan(userId, {
      planStartAt: newStartAt,
      planEndAt: newEndAt,
    });
  
    await this.planRepository.createPlanHistory(userId, user.planId);
  
    return { planId: user.planId, planStartAt: newStartAt, planEndAt: newEndAt };
  }
}
