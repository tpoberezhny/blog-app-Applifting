import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  user?: { id: string, name: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers['token'] as string;
    if (!token) {
      res.status(401).json({ message: 'Authorization token is missing or invalid' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & { id?: string, name?: string };

    if (decoded && typeof decoded === 'object' && 'id' in decoded) {
      req.user = { id: decoded.id as string, name: decoded.name as string };
      console.log(req.user);
      next();
    } else {
      res.status(401).json({ message: 'Authorization failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Authorization failed' });
  }
};