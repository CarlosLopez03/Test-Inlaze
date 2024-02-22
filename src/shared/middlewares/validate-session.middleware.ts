import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { NextFunction, Response } from 'express';

import { ICustomRequest } from '../interfaces/ICustomRequest.interface';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ValidateSessionMiddleware implements NestMiddleware {
  /**
   * Constructs a new instance of the RedisSessionMiddleware.
   * @param {RedisService} redisService - The RedisService instance for interacting with Redis.
   */
  constructor(private readonly redisService: RedisService) {}

  /**
   * Middleware function to validate if a user session exists in Redis.
   * @param {ICustomRequest} req - The incoming request.
   * @param {Response} res - The outgoing response.
   * @param {NextFunction} next - The next middleware function in the stack.
   * @throws {UnauthorizedException} Throws an UnauthorizedException if the user session does not exist.
   */
  async use(req: ICustomRequest, res: Response, next: NextFunction) {
    try {
      const { email } = req?.userExtract;

      // Validate session exist
      const SESSION_EXISTS = await this.redisService.existValue(email);

      if (!SESSION_EXISTS) throw new UnauthorizedException('Sesión caducada.');

      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: 'La sesión ha finalizado o el token es invalido.' });
    }
  }
}
