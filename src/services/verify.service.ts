import { JwtAccessPayload } from "../models/jwt-payload.model";
import { EncryptorService } from "./encryptor.service";

export class VerifyService {
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password: string): boolean {
    if (password.length < 4 || password.length > 50)
      return false;
    return true;
  }

  isValidAccessToken(token: JwtAccessPayload): boolean {
    if (!token.id || !token.role || token.type === 'refresh')
      return false;
    return true;
  }

  verifyPassword(password: string, userHash: string, salt: string): boolean {
    const encryptorService = new EncryptorService()

    const hash = encryptorService.getHash(password, salt, 10000, 64, 'sha512');

    return userHash === hash
  }
}
