import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { NextFunction, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

import { ICustomRequest } from '../interfaces/ICustomRequest.interface';
import { IDecodeToken } from '../interfaces/IDecodeToken.interface';

/**
 * Middleware to extract and validate JWT token from the request.
 */
@Injectable()
export class ExtractCredentialsMiddleware implements NestMiddleware {
  /**
   * Creates an instance of ExtractCredentialsMiddleware.
   * @param {JwtService} jwtService - The JWT service for token verification.
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Extracts and validates the JWT token from the request.
   * @param {ICustomRequest} req - The custom request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next function in the middleware chain.
   * @throws {UnauthorizedException} If the token is not provided.
   * @throws {UnauthorizedException} If the provided token is expired or invalid.
   */
  use(req: ICustomRequest, res: Response, next: NextFunction) {
    // Extract token
    const TOKEN =
      req?.body?.authorization || req?.headers?.authorization?.slice(7);

    // Valid token
    if (!TOKEN) throw new UnauthorizedException('Token no proporcionado.');

    try {
      // Extract info token
      const TOKEN_DECODE: IDecodeToken = this.jwtService.verify(TOKEN, {
        secret: process.env.JWT_TOKEN,
      });

      const { userId, email } = TOKEN_DECODE;

      req.userExtract = { userId, email };

      next();
    } catch (error) {
      res
        .status(401)
        .json({ message: 'El token proporcionado ha expirado o es invalido.' });
    }
  }
}
