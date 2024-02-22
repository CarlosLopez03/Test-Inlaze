import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Query,
  Req,
  Res,
  ValidationPipe,
} from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { UsersService } from '../service/users.service';
import { EmailUserDto, UpdateUserDto } from '../dto/user.dto';
import { ICustomRequest } from 'src/shared/interfaces/ICustomRequest.interface';

@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Retrieves information about the user.
   * @param {Response} res - The HTTP response object.
   * @param {Request} req - The HTTP request object.
   * @returns {Promise<Response>} A promise that resolves to the user information.
   */
  @Get('')
  @ApiResponse({
    status: 200,
    description: 'Retorna información de un usuario.',
  })
  @ApiBearerAuth()
  async infoOneUser(
    @Query(ValidationPipe) dataUser: EmailUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const RESPONSE = await this.usersService.infoOneUser(
        { email: dataUser?.emailUser },
        { password: 0 },
      );

      if (!RESPONSE) throw new BadRequestException('Email no valido.');

      return res.status(200).json(RESPONSE);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  /**
   * Updates user information.
   * @param {EmailUserDto} dataUser - The data containing the user's email.
   * @param {UpdateUserDto} body - The updated user data.
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<Response>} A promise that resolves to the updated user information.
   */
  @Put('')
  @ApiResponse({
    status: 200,
    description: 'Devuelve la información actualizada del usuario.',
  })
  @ApiBearerAuth()
  async updateOne(
    @Query(ValidationPipe) dataUser: EmailUserDto,
    @Body(ValidationPipe) body: UpdateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const RESPONSE = await this.usersService.updateUser(
        dataUser?.emailUser,
        body,
      );
      return res.status(RESPONSE?.['code'] || 200).json(RESPONSE);
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  /**
   * Deletes a user.
   * @param {EmailUserDto} dataUser - EmailUserDto containing the email of the user to delete.
   * @param {Response} res - Express Response object.
   * @returns A response indicating successful deletion or an error response.
   */
  @Delete('')
  @ApiResponse({
    status: 200,
    description: 'Elimina a un usuario exitosamente.',
  })
  @ApiBearerAuth()
  async deleteOne(
    @Query(ValidationPipe) dataUser: EmailUserDto,
    @Res() res: Response,
    @Req() req: ICustomRequest,
  ): Promise<Response> {
    try {
      const RESPONSE = await this.usersService.deleteUser(
        dataUser?.emailUser,
        req?.userExtract?.email,
      );
      return res.status(RESPONSE?.['code'] || 200).json(RESPONSE);
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}
