import { Plan } from "@prisma/client";
import { PlanRepository } from "../repositories/PlanRepository";
import { addHours, differenceInHours, isAfter } from "date-fns";
import { UserRepository } from "../repositories/UserRepository";

export class PlanService {
  constructor(private readonly planRepository: PlanRepository, private readonly userRepository: UserRepository) {}
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


  async subcribeUserToPlan(userId:string, planId:string){
    const user = await this.userRepository.findById(userId);
     
    if (!user) {
      throw new Error("Usuario nao encontrado");
    }

    const { id, planEndAt, planStartAt } = user;

    const currentDate = new Date();

    const plan = await this.planRepository.findById(planId);

    if (!plan) {
      throw new Error("Plano nao encontrado");
    }

    const duration = plan?.durationInHours;

    let newPlanStartAt, newPlanEndAt;

    newPlanStartAt = currentDate;
    newPlanEndAt = addHours(newPlanStartAt, duration);

    if (!!planEndAt && !!planStartAt) {
      const isOutdated = isAfter(currentDate, planEndAt);

      if (isOutdated) {
        newPlanEndAt = addHours(newPlanStartAt, duration);
      }

      if (!isOutdated) {
        const hoursAvaliable = differenceInHours(planEndAt, currentDate);
        newPlanEndAt = addHours(newPlanStartAt, hoursAvaliable + duration);
      }
    }

    await this.userRepository.subscribePlan({
      planId,
      id,
      planEndAt: newPlanEndAt,
      planStartAt: newPlanStartAt,
    });
  }
  async findByCoupon(coupon: string) {
    return await this.planRepository.findByCoupon(coupon);
  }
}
