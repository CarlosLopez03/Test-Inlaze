import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IPublications } from '../interface/IPublication.interface';
import { IResponse } from 'src/shared/interfaces/IResponse.interface';
import { responseFail, responseSucess } from 'src/shared/utils/response.util';
import { dateFunctionSave } from 'src/shared/function/dateFunction.function';
import { FilterDto, PaginationDto } from '../dto/publication.dto';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectModel('Posts') private publicationModel: Model<IPublications>,
  ) {}

  /**
   * Filters publications based on the provided criteria.
   * @param {PaginationDto} paginationDto DTO for pagination.
   * @param {FilterDto} filterDto DTO for publication filters.
   * @returns A response containing the filtered publications.
   */
  async filterPublications(
    paginationDto: PaginationDto,
    filterDto: FilterDto,
  ): Promise<IResponse> {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const { userId, likes } = filterDto;

      // Build Query
      const QUERY: FilterDto = {};

      if (userId) {
        QUERY['userId'] = userId;
      }

      if (likes) {
        QUERY['likes'] = { $gte: likes };
      }

      const PUBLICATIONS_FILTER = await this.publicationModel.aggregate([
        {
          $match: QUERY,
        },
        {
          $project: { _id: 0, title: 1, content: 1, createdAt: 1, userId: 1 },
        },
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: 'Users',
            let: {
              userId: { $toString: '$userId' },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [{ $toString: '$_id' }, '$$userId'],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  fullName: 1,
                },
              },
            ],
            as: 'dataUser',
          },
        },
        {
          $addFields: {
            nameUser: { $arrayElemAt: ['$dataUser', 0] },
          },
        },
        {
          $unset: ['dataUser'],
        },
        {
          $project: {
            title: 1,
            content: 1,
            createdAt: 1,
            user: '$nameUser.fullName',
          },
        },
      ]);

      return responseSucess({
        data: PUBLICATIONS_FILTER,
      });
    } catch (error) {
      console.log(error);

      return responseFail({
        message: 'Error en la obtención de las publicaciones.',
        state: false,
      });
    }
  }

  /**
   * Creates a new publication.
   * @param {IPublications} publication - The publication object.
   * @param {string} userId - The ID of the user creating the publication.
   * @returns {Promise<IResponse>} A response indicating success or failure.
   */
  async createPublication(
    publication: IPublications,
    userId: string,
  ): Promise<IResponse> {
    try {
      publication.createdAt = dateFunctionSave(new Date());
      publication.userId = userId;

      const NEW_PUBLICATION = new this.publicationModel(publication);
      await NEW_PUBLICATION.save();

      return responseSucess({
        message: 'Publicación registrada exitosamente.',
      });
    } catch (error) {
      return responseFail({
        message: 'Error en la creación de la publicación.',
        state: false,
      });
    }
  }

  /**
   * Updates a publication.
   * @param {string} idPublication - The ID of the publication to update.
   * @param {IPublications} publication - The updated publication data.
   * @returns {Promise<IResponse>} A promise that resolves to an IResponse indicating the success or failure of the operation.
   */
  async updatePublication(
    idPublication: string,
    publication: IPublications,
  ): Promise<IResponse> {
    try {
      publication.updatedAt = dateFunctionSave(new Date());

      const UPDATED_PUBLICATION = await this.publicationModel.findOneAndUpdate(
        {
          _id: idPublication,
        },
        {
          $set: publication,
        },
        {
          new: true,
        },
      );

      if (!UPDATED_PUBLICATION) {
        return responseFail({
          message: 'Publicación no encontrado.',
          state: false,
        });
      }

      return responseSucess({
        message: 'Publicación actualizada exitosamente.',
      });
    } catch (error) {
      return responseFail({
        message: 'Error en la actualización de la publicación.',
        state: false,
      });
    }
  }

  /**
   * Deletes a publication.
   * @param {string} idPublication - The ID of the publication to delete.
   * @returns {Promise<IResponse>} A promise that resolves to an object indicating the success or failure of the operation.
   */
  async deletePublication(idPublication: string): Promise<IResponse> {
    try {
      // Search id and update with soft delete
      const DELETED_PUBLICATION = await this.publicationModel.findByIdAndUpdate(
        { _id: idPublication },
        {
          $set: { deletedAt: dateFunctionSave(new Date()) },
        },
        { new: true },
      );

      if (!DELETED_PUBLICATION) {
        return responseFail({
          message: 'Publicación no encontrado.',
          state: false,
        });
      }

      return responseSucess({
        message: 'Publicación eliminado correctamente.',
      });
    } catch (error) {
      return responseFail({
        message: 'Error en la eliminación de la publicación.',
        state: false,
      });
    }
  }

  /**
   * Adds a like to the specified publication.
   * @param {string} idPublication - The ID of the publication to like.
   * @param {string} userId - The ID of the user who is liking the publication.
   * @returns {Promise<IResponse>} A Promise that resolves to the response object indicating success or failure.
   */
  async likePublication(idPublication: string, userId: string): Promise<IResponse> {
    try {
      // Valid publication
      const PUBLICATION = await this.publicationModel.findOne(
        {
          _id: idPublication,
        },
        { _id: 1, userLikes: 1, likes: 1 },
      );

      if (!PUBLICATION)
        return responseFail({ message: 'La publicación no existe.' });

      // Verify if the user has already liked
      if (PUBLICATION?.userLikes?.includes(userId))
        return responseFail({
          message: 'El usuario ya ha dado like a esta publicación.',
        });

      PUBLICATION.userLikes.push(userId);
      PUBLICATION.likes += 1;

      await PUBLICATION.save();

      return responseSucess({
        message: 'Like agregado exitosamente.',
      });
    } catch (error) {
      return responseFail({
        message: 'Error al dar Like a la publicación.',
        state: false,
      });
    }
  }

  /**
   * Checks if a user is the owner of a publication.
   * @param {string} userId - The ID of the user.
   * @param {string} publicationId - The ID of the publication.
   * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the user is the owner of the publication.
   */
  async isUserOwnerOfPublication(
    userId: string,
    publicationId: string,
  ): Promise<boolean> {
    try {
      const PUBLICATION = await this.publicationModel
        .findOne({ _id: publicationId, userId }, { _id: 1 })
        .lean()
        .exec();

      return !!PUBLICATION;
    } catch (error) {
      return false;
    }
  }
}
