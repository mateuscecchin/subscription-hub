import { Response } from "express";
import { Request } from "../@types/Request";
import { UserService } from "../services/UserService";
import { PlanService } from "../services/PlanService";
import { addHours, differenceInHours, isAfter } from "date-fns";

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly planService: PlanService
  ) {}

  async create(req: Request, res: Response) {
    try {
      const { body, ip } = req;

      await this.userService.create({ ...body, role: "UNKNOWN", ip });

      res.status(201).json({ message: "Usuario criado com sucesso!" });
    } catch (err) {
      console.log("[ERRO USER CREATE]", err);
      res.status(500).json({ message: "Erro ao criar conta!" });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const user = req.user!;

      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar usuario" });
      console.log("[ERROR USER ME]", err);
    }
  }

  async plan(req: Request, res: Response) {
    try {
      const { planId } = req.body;
      const { id, planEndAt, planStartAt } = req.user!;

      const currentDate = new Date();

      const plan = await this.planService.findById(planId);

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

      await this.userService.subscribePlan({
        planId,
        id,
        planEndAt: newPlanEndAt,
        planStartAt: newPlanStartAt,
      });

      res.status(200).json({ message: "Inscrito a um plano com sucesso!" });
    } catch (err) {
      console.log("[ERROR SUBSCRIBE PLAN]", err);
      res.status(500).json({ message: "Erro ao se inscrever a um plano" });
    }
  }
}
