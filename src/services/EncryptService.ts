import bcrypt from "bcrypt";

export class EncryptService {
  static async hash(value: string) {
    return await bcrypt.hash(value, Number(process.env.SALTS));
  }

  static async compare(rawValue: string, encryptedValue: string) {
    return await bcrypt.compare(rawValue, encryptedValue);
  }
}
