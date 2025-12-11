import { Request, Response } from "express"
import { JwtService } from "../services/jwt.service";
import { VerifyService } from "../services/verify.service";

export const accessMiddleware = async (req: Request, res: Response, next: any) => {
  const jwtService = new JwtService()
  const verifyService = new VerifyService()

  const token = jwtService.getTokenFromRequestHeaders(req);
 
  jwtService.verifyAccessToken(token)

  const decodedToken = jwtService.decodeToken('access', token) as any;
  const userId = req.params.userId || req.body.userId;

  if (!verifyService.isValidAccessToken(decodedToken))
    return res.status(401).json({
      error: 'Token invalid',
      code: 'INVALID_TOKEN_ERROR'
    })

  if (decodedToken.role === 'admin' || userId === decodedToken.id) {
    next()
  } else {
    return res.status(403).json({
      error: 'Admin role or own user ID required',
      code: 'ACCESS_DENIED'
    })
  }
}
