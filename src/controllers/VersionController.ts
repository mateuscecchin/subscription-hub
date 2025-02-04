import { Response } from "express";
import { Request } from "../@types/Request";
import { VersionService } from "../services/VersionService";
import { db } from "../configs/prisma";

export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  async create(req: Request, res: Response) {
    try {
      const version = req?.body?.version;
      if (!version) {
        return res
          .status(500)
          .json({ message: "Nao foi possivel criar uma versao" });
      }
      await db.version.create({
        data: { version },
      });

      return res.status(202).json({ message: "Versao criada" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Nao foi possivel criar uma versao" });
    }
  }

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
