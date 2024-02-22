import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from '../service/auth.service';
import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginDto } from '../dto/login.dto';
import { ICustomRequest } from 'src/shared/interfaces/ICustomRequest.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Logs in a user with the provided credentials.
   * @param {LoginDto} body - LoginDto containing user credentials.
   * @param {Response} res - Express Response object.
   * @returns A response with a JWT token if successful, or an error response.
   */
  @Post('login')
  @ApiResponse({ status: 200, description: 'Jwt token.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  async login(
    @Body(ValidationPipe) body: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const RESPONSE = await this.authService.login(body);
      return res.status(RESPONSE?.['code'] || 200).json(RESPONSE);
    } catch (error) {
      console.warn('Error método(controller): login');
      return res.status(400).json(error);
    }
  }

  /**
   * Registers a new user with the provided information.
   * @param {Response} res - Express Response object.
   * @returns A response indicating successful registration or an error response.
   */
  @Post('register')
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  async registerUser(
    @Body(ValidationPipe) body: RegisterUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const RESPONSE = await this.authService.registerUser(body);
      return res.status(RESPONSE?.['code'] || 200).json(RESPONSE);
    } catch (error) {
      console.warn('Error método(controller): registerUser');
      return res.status(400).json(error);
    }
  }

  /**
   * Refreshes the JWT token for a user.
   * @param {Response} res - Express Response object.
   * @param {ICustomRequest} req - Express Request object with user information.
   * @returns A response with a new JWT token if successful, or an error response.
   */
  @Post('refresh')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Nuevo jwt token.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  async refreshToken(
    @Res() res: Response,
    @Req() req: ICustomRequest,
  ): Promise<Response> {
    try {
      const RESPONSE = await this.authService.refreshToken(req?.userExtract);
      return res.status(RESPONSE?.['code'] || 200).json(RESPONSE);
    } catch (error) {
      console.warn('Error método(controller): refresh');
      return res.status(400).json(error);
    }
  }

  /**
   * Logs out a user, invalidating their session.
   * @param {Response} res - Express Response object.
   * @param {ICustomRequest} req - Express Request object with user information.
   * @returns A response indicating successful logout or an error response.
   */
  @Post('logout')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Cierre de sesión exitoso.' })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  async logout(
    @Res() res: Response,
    @Req() req: ICustomRequest,
  ): Promise<Response> {
    try {
      const RESPONSE = await this.authService.logout(req?.userExtract?.email);
      return res.status(RESPONSE?.['code'] || 200).json(RESPONSE);
    } catch (error) {
      console.warn('Error método(controller): logout');
      return res.status(400).json(error);
    }
  }
}
