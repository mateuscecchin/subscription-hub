import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { UserService } from "../services/UserService";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY ?? "";

export async function authenticate(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.sendStatus(401);
    }

    jwt.verify(
      token,
      JWT_PRIVATE_KEY,
      async (err: jwt.VerifyErrors | null, user: any) => {
        if (err) {
          return res.sendStatus(403);
        }

        const userRepository = new UserRepository();
        const userService = new UserService(userRepository);

        const result = await userService.findUserById(user.id);

        if (!result) {
          throw new Error("Usuario nao encontrado");
        }

        const { password, ...userClean } = result;
        req.user = userClean;
        next();
      }
    );
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while authenticating the token." });
  }
}
