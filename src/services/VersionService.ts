import { Version } from "@prisma/client";
import { VersionRepository } from "../repositories/VersionRepository";

export class VersionService {
  constructor(private readonly versionRepository: VersionRepository) {}

  async create({ version }: { version: string }) {
    await this.versionRepository.create({ version } as Version);
  }

  async findLastVersion() {
    return await this.versionRepository.findLastVersion();
  }
}
