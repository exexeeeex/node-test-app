import * as dotenv from 'dotenv'
import * as jwt from 'jsonwebtoken'
import { JwtAccessPayload, JwtRefreshPayload } from 'src/models/jwt-payload.model';
import { TokenResponse } from 'src/models/token-response.model';
import { Request } from 'express';

dotenv.config();

export class JwtService {
  private _jwtAccessSecret = process.env.JWT_ACCESS_SECRET
  private _jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  private _jwtAccessExp = process.env.JWT_ACCESS_EXP;
  private _jwtRefreshExp = process.env.JWT_REFRESH_EXP;

  writeAccessToken(userId: string, email: string, role: string): string {
    return jwt.sign({
      email: email,
      id: userId,
      type: 'access',
      role: role
    },
    this._jwtAccessSecret,
    {
      expiresIn: this._jwtAccessExp,
      algorithm: 'HS256'
    })
  }

  writeRefreshToken(userId: string, hash: string): string {
    return jwt.sign({
      id: userId,
      hash: hash,
      type: 'refresh'
    },
    this._jwtRefreshSecret,
    {
      expiresIn: this._jwtRefreshExp,
      algorithm: 'HS256'
    })
  }

  writeTokens(userId: string, email: string, hash: string, role: string): TokenResponse {
    return {
      accessToken: this.writeAccessToken(userId, email, role),
      refreshToken: this.writeRefreshToken(userId, hash)
    } as TokenResponse
  }

  decodeToken(tokenType: 'refresh' | 'access', token: string) {
      const secret = tokenType === 'refresh'
        ? this._jwtRefreshSecret
        : this._jwtAccessSecret

      try {
       const decoded = jwt.verify(token, secret);

       const payload = decoded as jwt.JwtPayload;

       if (payload.type !== tokenType)
         throw new Error('Invalid token type')

      if (payload.type === 'access')
        return decoded as JwtAccessPayload
      else return decoded as JwtRefreshPayload

      } catch (error) {
        throw error;
      }
  }

  verifyAccessToken(token: string): jwt.JwtPayload | string {
    try {
      console.log(token)
      return jwt.verify(token, this._jwtAccessSecret)
    } catch (error) {
      throw new Error(`Ivalid access token: ${error.message}`)
    }
  }

  verifyRefreshToken(token: string): jwt.JwtPayload | string {
    try {
      return jwt.verify(token, this._jwtRefreshSecret)
    } catch (error) {
      throw new Error(`Invalid refresh token: ${error.message}`)
    }
  }

  getTokenFromRequestHeaders(req: Request): string {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      throw new Error('Auth header is empty!')

    if (!authHeader.startsWith('Bearer '))
      throw new Error(`Token not found in headers`)
    
    const token = authHeader.split(' ')[1];

    if (!token)
      throw new Error('Token is empty')   
    
    return token;
  }
}
