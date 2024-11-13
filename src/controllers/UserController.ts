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
      const { body } = req;

      await this.userService.create({ ...body, role: "UNKNOWN" });

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

  async findAll(req: Request, res: Response) {
    try {
      const users = await this.userService.findAll();

      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Erro ao buscar usuarios" });
      console.log("[ERROR USER ME]", err);
    }
  }

  async plan(req: Request, res: Response) {
    try {
      const { planId, userId } = req.body;

      const user = await this.userService.findUserById(userId);

      if (!user) {
        throw new Error("Usuario nao encontrado");
      }

      const { id, planEndAt, planStartAt } = user;

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
