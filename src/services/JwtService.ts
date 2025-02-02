import jwt from "jsonwebtoken";

export class JwtService {
  static sign(value: any) {
    return jwt.sign(value, process.env.JWT_PRIVATE_KEY ?? "");
  }

  static parse(token: string): any {
    return jwt.verify(token, process.env.JWT_PRIVATE_KEY ?? "");
  }
}
