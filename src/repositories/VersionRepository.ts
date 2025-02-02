import { Version } from "@prisma/client";
import { db } from "../configs/prisma";

export class VersionRepository {
  async findLastVersion() {
    return await db.version.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(version: Version) {
    return await db.version.create({ data: version });
  }
}
