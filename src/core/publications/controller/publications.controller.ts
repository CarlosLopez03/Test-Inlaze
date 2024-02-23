import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { PublicationsService } from '../service/publications.service';
import {
  CreatePublicationDto,
  IdPublicationDto,
  UpdatePublicationDto,
} from '../dto/publication.dto';
import { ICustomRequest } from 'src/shared/interfaces/ICustomRequest.interface';
import { PublicationOwnerGuard } from '../guard/publication-owner.guard';

@Controller('post')
@ApiTags('Post')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  /**
   * Creates a new publication.
   * @param {CreatePublicationDto} body - The data of the publication to be created.
   * @param {Response} res - The HTTP response object.
   * @param {ICustomRequest} req - The custom request object containing user information.
   * @returns {Promise<Response>} The HTTP response.
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Publicación registradada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  @ApiBearerAuth()
  async createPublication(
    @Body(ValidationPipe) body: CreatePublicationDto,
    @Res() res: Response,
    @Req() req: ICustomRequest,
  ): Promise<Response> {
    try {
      const { userId } = req?.userExtract;
      const RESPONSE = await this.publicationsService.createPublication(
        body,
        userId,
      );
      return res.status(RESPONSE?.['code'] || 200).json(RESPONSE);
    } catch (error) {
      console.warn('Error método(controller): createPublication');
      return res.status(400).json(error);
    }
  }

  /**
   * Update a publication.
   * @param {IdPublicationDto} publication - The publication ID.
   * @param {UpdatePublicationDto} body - The updated publication data.
   * @param {Response} res - The HTTP response object.
   * @returns {Promise<Response>} The HTTP response with the update result.
   */
  @Put()
  @ApiResponse({
    status: 200,
    description: 'Publicación Actualizada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  @ApiBearerAuth()
  @UseGuards(PublicationOwnerGuard)
  async updatePublication(
    @Query(ValidationPipe) publication: IdPublicationDto,
    @Body(ValidationPipe) body: UpdatePublicationDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const RESPONSE = await this.publicationsService.updatePublication(
        publication?.idPublication,
        body,
      );
      return res.status(RESPONSE?.['code'] || 200).json(RESPONSE);
    } catch (error) {
      console.warn('Error método(controller): updatePublication');
      return res.status(400).json(error);
    }
  }

  /**
   * Deletes a publication.
   * @param {IdPublicationDto} publication - The ID of the publication to delete.
   * @returns {Promise<Response>} A promise that resolves to a Response indicating the success or failure of the operation.
   */
  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Publicación eliminada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Error en la solicitud.' })
  @ApiBearerAuth()
  @UseGuards(PublicationOwnerGuard)
  async deletePublication(
    @Query(ValidationPipe) publication: IdPublicationDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const RESPONSE = await this.publicationsService.deletePublication(
        publication?.idPublication,
      );
      return res.status(RESPONSE?.['code'] || 200).json(RESPONSE);
    } catch (error) {
      console.warn('Error método(controller): deletePublication');
      return res.status(400).json(error);
    }
  }
}
