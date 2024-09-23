import { UserRepository } from "../repositories/UserRepository";
import { EncryptService } from "./EncryptService";
import { JwtService } from "./JwtService";

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async logIn({ email, password }: { email: string; password: string }) {
    const result = await this.userRepository.findByEmail(email);

    if (!result) {
      throw new Error("Usuario nao encontrado!");
    }

    const { password: userPassword, ...user } = result;

    const isPasswordCorrect = await EncryptService.compare(
      password,
      userPassword
    );

    if (!isPasswordCorrect) {
      throw new Error("Senha incorreta!");
    }

    return { token: JwtService.sign(user) };
  }
}
