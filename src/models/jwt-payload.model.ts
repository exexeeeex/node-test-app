import * as jwt from 'jsonwebtoken';

export interface JwtAccessPayload extends jwt.JwtPayload {
  id: string;
  role: string;
  email: string;
  type: string;
}

export interface JwtRefreshPayload extends jwt.JwtPayload {
  id: string;
  role: string;
  email: string;
  type: string
}
