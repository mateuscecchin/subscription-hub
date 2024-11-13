import { User } from "@prisma/client";
import { UserRepository } from "../repositories/UserRepository";
import { EncryptService } from "./EncryptService";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(user: User) {
    const isNotNewUser = await this.userRepository.findByEmail(user.email);

    if (!!isNotNewUser) {
      throw new Error("Usuario ja existe!");
    }

    const hashPassword = await EncryptService.hash(user.password);

    await this.userRepository.create({
      ...user,
      password: hashPassword,
    });

    return { message: "Usuario criado!" };
  }

  async findUserById(id: string) {
    return await this.userRepository.findById(id);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async delete(id: string) {
    return await this.userRepository.delete(id);
  }

  async subscribePlan({
    id,
    planId,
    planEndAt,
    planStartAt,
  }: Pick<User, "planId" | "planEndAt" | "planStartAt" | "id">) {
    return await this.userRepository.update({
      id,
      planId,
      planStartAt,
      planEndAt,
    });
  }
}
