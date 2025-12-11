import crypto from 'crypto'

export class EncryptorService {
   hashPassword(password: string): { salt: string; hash: string } {
    const salt = crypto.randomBytes(16).toString('hex');
    
    const hash = crypto
      .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
      .toString('hex');
    
    return { salt, hash };
  }

  getHash(
    password: string, 
    salt: string, 
    iterations: number = 10000, 
    bytes: number = 64, 
    algorithm: string = 'sha512'): string {
      return crypto
        .pbkdf2Sync(password, salt, iterations, bytes, algorithm)
        .toString('hex');
  }
}
