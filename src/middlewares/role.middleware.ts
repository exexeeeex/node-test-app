import { Request, Response } from "express"
import { JwtService } from "../services/jwt.service"
import { VerifyService } from "../services/verify.service";

export const roleMiddleware = (req: Request, res: Response, next: any) => {
  const jwtService = new JwtService();
  const verifyService = new VerifyService()

  const token = jwtService.getTokenFromRequestHeaders(req);
  jwtService.verifyAccessToken(token);
  
  const decodedToken = jwtService.decodeToken('access', token) as any;

  if (!verifyService.isValidAccessToken(decodedToken))
    return res.status(401).json({
      error: 'Token invalid',
      code: 'INVALID_TOKEN_ERROR'
    }) 
   
  if (decodedToken.role !== 'admin')
    res.status(403).json({
      error: 'Not admin',
      code: 'INVALID_ROLE_ERROR'
    })

  next()
}
