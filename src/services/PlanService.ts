import { Plan } from "@prisma/client";
import { PlanRepository } from "../repositories/PlanRepository";

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
}
