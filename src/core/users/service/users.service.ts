import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { IUser } from '../interface/IUser.interface';
import { responseFail, responseSucess } from 'src/shared/utils/response.util';
import { dateFunctionSave } from 'src/shared/function/dateFunction.function';
import { IResponse } from 'src/shared/interfaces/IResponse.interface';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private userModel: Model<IUser>,
    private redisService: RedisService,
  ) {}

  /**
   * Retrieves information about a single user from the database.
   * @param {object} filterGeneric - The filter criteria to find the user.
   * @param {object} projectionGeneric - The projection criteria to specify which fields to include or exclude.
   * @returns {Promise<IUser | null>} A promise that resolves to the user information if found, otherwise null.
   */
  async infoOneUser(
    filterGeneric: object,
    projectionGeneric: object,
  ): Promise<IUser | null> {
    try {
      return await this.userModel
        .findOne(filterGeneric, projectionGeneric)
        .lean()
        .exec();
    } catch (error) {
      return null;
    }
  }

  /**
   * Creates a new user in the database.
   * @param {IUser} user - The user data to create.
   * @returns {Promise<IResponse>} - A promise resolving to an object indicating the operation result.
   */
  async createUser(user: IUser): Promise<IResponse> {
    try {
      user.createdAt = dateFunctionSave(new Date());

      const NEW_USER = new this.userModel(user);
      await NEW_USER.save();

      return responseSucess({
        message: 'Usuario registrado exitosamente.',
      });
    } catch (error) {
      return responseFail({
        message: 'Error en la creación del usuario.',
        state: false,
      });
    }
  }

  /**
   * Updates a user's information in the database.
   * @param {string} emailToUpdate - The email of the user to update.
   * @param {IUser} user - The updated user data.
   * @returns {Promise<IResponse>} A promise that resolves to an object indicating the success or failure of the update operation.
   */
  async updateUser(emailToUpdate: string, user: IUser): Promise<IResponse> {
    try {
      // Hash the password if it exists in the user data
      if (user?.password) {
        user.password = await bcrypt?.hash(user?.password, 10);
      }

      user.updatedAt = dateFunctionSave(new Date());

      const UPDATED_USER = await this.userModel.findOneAndUpdate(
        {
          email: emailToUpdate,
        },
        { $set: user },
        {
          new: true,
        },
      );

      if (!UPDATED_USER) {
        return responseFail({
          message: 'Usuario no encontrado.',
          state: false,
        });
      }

      return {
        state: true,
        message: 'Usuario actualizado exitosamente.',
      };
    } catch (error) {
      return responseFail({
        message: 'Error en la actualización del usuario.',
        state: false,
      });
    }
  }

  /**
   * Deletes a user with soft delete.
   * @param {string} emailToUpdate - Email of the user to be deleted.
   * @returns An object indicating success or failure of the deletion operation.
   */
  async deleteUser(
    emailToUpdate: string,
    emailUserInSession: string,
  ): Promise<IResponse> {
    try {
      // You cannot eliminate yourself.
      if (emailToUpdate === emailUserInSession)
        return responseFail({
          message: 'Un usuario no se puede eliminar así mismo.',
        });

      // Search email and update with soft delete
      const DELETED_USER = await this.userModel.findOneAndUpdate(
        {
          email: emailToUpdate,
        },
        { $set: { deletedAt: dateFunctionSave(new Date()) } },
        {
          new: true,
        },
      );

      if (!DELETED_USER) {
        return responseFail({
          message: 'Usuario no encontrado.',
          state: false,
        });
      }

      // Delete session
      await this.redisService.delValue(emailToUpdate);

      return {
        state: true,
        message: 'Usuario eliminado correctamente.',
      };
    } catch (error) {
      return responseFail({
        message: 'Error en la actualización del usuario.',
        state: false,
      });
    }
  }
}
