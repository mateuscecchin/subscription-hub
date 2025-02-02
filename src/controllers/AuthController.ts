import { Response } from "express";
import { Request } from "../@types/Request";
import { AuthService } from "../services/AuthService";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async logIn(req: Request, res: Response) {
    try {
      const { body } = req;

      const { token } = await this.authService.logIn(body);

      res.status(200).json({ message: "Usuario logado!", token });
    } catch (err) {
      console.log("[ERRO LOGIN]", err);
      res.status(500).json({ message: "Erro ao logar!" });
    }
  }
}
