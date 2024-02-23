import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IPublications } from '../interface/IPublication.interface';
import { IResponse } from 'src/shared/interfaces/IResponse.interface';
import { responseFail, responseSucess } from 'src/shared/utils/response.util';
import { dateFunctionSave } from 'src/shared/function/dateFunction.function';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectModel('Posts') private publicationModel: Model<IPublications>,
  ) {}

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

      return {
        state: true,
        message: 'Publicación actualizada exitosamente.',
      };
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

      return {
        state: true,
        message: 'Publicación eliminado correctamente.',
      };
    } catch (error) {
      return responseFail({
        message: 'Error en la eliminación de la publicación.',
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
