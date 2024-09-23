import { Response } from "express";
import { Request } from "../@types/Request";
import { VersionService } from "../services/VersionService";

export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  async findLastVersion(req: Request, res: Response) {
    try {
      const result = await this.versionService.findLastVersion();

      if (!result) {
        throw new Error("Versao nao encotrada");
      }

      const { version } = result;

      res.status(200).json({ version });
    } catch (err: any) {
      console.log("[ERROR VERSION]", err);
      res.status(500).json({ message: err.message });
    }
  }
}
