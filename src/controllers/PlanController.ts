import { Response } from "express";
import { Request } from "../@types/Request";
import { PlanService } from "../services/PlanService";
import { isAfter } from "date-fns";

export class PlanController {
  constructor(private readonly planService: PlanService) {}

  async findAll(req: Request, res: Response) {
    try {
      const plans = await this.planService.findAll();

      res.status(200).json(plans);
    } catch (err) {
      res.status(500).json({ message: "Erro ao listar planos" });
    }
  }

  async check(req: Request, res: Response) {
    try {
      const { planEndAt } = req.user!;

      const isOutdated = isAfter(new Date(), planEndAt!);

      if (isOutdated) {
        throw new Error("Plano finalizado!");
      }
      res.status(200).json({ message: "Plano normal" });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { description, name, durationInHours, price } = req.body!;

      await this.planService.create({
        description,
        name,
        durationInHours,
        price,
      });

      res.status(201).json({ message: "Plano criado com sucesso!" });
    } catch (err) {
      res.status(500).json({ message: "Erro ao criar plano" });
      console.log("[ERROR CREATE PLAN]", err);
    }
  }
}
