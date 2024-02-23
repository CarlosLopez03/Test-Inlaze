import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { IUser } from 'src/core/users/interface/IUser.interface';
import { UsersService } from 'src/core/users/service/users.service';
import { IResponse } from 'src/shared/interfaces/IResponse.interface';
import { responseFail, responseSucess } from 'src/shared/utils/response.util';
import { LoginDto } from '../dto/login.dto';
import { RedisService } from 'src/shared/redis/redis.service';

@Injectable()
export class AuthService {
  /**
   * Constructs a new instance of the AuthService.
   * @param {UsersService} userService - The UsersService instance for user-related operations.
   * @param {JwtService} jwtservice - The JwtService instance for JWT token management.
   * @param {RedisService} redisService - The RedisService instance for interacting with Redis.
   */
  constructor(
    private userService: UsersService,
    private jwtservice: JwtService,
    private redisService: RedisService,
  ) {}

  /**
   * Logs in a user with the provided credentials and generates a JWT token.
   * @param {LoginDto} credentials - The user's login credentials including email and password.
   * @returns {Promise<IResponse>} A promise resolving to an object containing the JWT token.
   */
  async login(credentials: LoginDto): Promise<IResponse> {
    try {
      const { password, email } = credentials;

      // Search user by email
      const USER = await this.userService.infoOneUser(
        { email, deletedAt: { $exists: false } },
        { _id: 1, password: 1, email: 1 },
      );

      // Verify user and password correct
      if (!USER || !(await bcrypt.compare(password, USER?.password)))
        return responseFail({
          message: 'Credenciales inválidas.',
          code: 401,
        });

      // Create jwt Token
      const TOKEN = this.generateToken(USER?._id?.toString(), USER?.email);

      // Save register in docker
      await this.redisService.setValue(USER?.email, TOKEN);

      return responseSucess({
        token: TOKEN,
      });
    } catch (error) {
      return responseFail({
        message: 'Error en la solicitud.',
        state: false,
      });
    }
  }

  /**
   * Registers a new user.
   * @param {IUser} body - The user data to register, including the password.
   * @returns {Promise<IResponse>} A promise resolving to an object indicating the registration result.
   */
  async registerUser(body: IUser): Promise<IResponse> {
    try {
      const { password, ...res } = body;

      // Encrypt password
      const HASHED_PASSWORD = await bcrypt?.hash(password, 10);

      const RESPONSE = await this.userService.createUser({
        ...res,
        password: HASHED_PASSWORD,
      });

      // Send confirmation email using Redis
      await this.redisService.aggregateToQueue(res?.email);

      return responseSucess({
        message: RESPONSE?.message,
      });
    } catch (error) {
      return responseFail({
        message: 'Error en la solicitud.',
        state: false,
      });
    }
  }

  /**
   * Generates a new JWT token for refreshing the user's session.
   * @param {IUser} body - The user data including userId and email.
   * @returns {Promise<IResponse>} A promise that resolves to an object containing the new token.
   * @throws {Error} If there is an error in the process.
   */
  async refreshToken(body: IUser): Promise<IResponse> {
    try {
      const { userId, email } = body;

      // Create new token
      const TOKEN = this.generateToken(userId, email);

      // Save register in docker
      await this.redisService.setValue(email, TOKEN);

      return responseSucess({
        token: TOKEN,
      });
    } catch (error) {
      return responseFail({
        message: 'Error en la solicitud.',
        state: false,
      });
    }
  }

  /**
   * Logs out a user by removing their authentication token from Redis.
   * @param {string} email - The email of the user whose session will be terminated.
   * @returns {Promise<IResponse>} An object indicating the result of the logout operation.
   * If logout was successful, it returns a success object with a message.
   * If no token associated with the user was found, it returns a failure object with a message indicating the same.
   * If an error occurred during the operation, it returns a failure object with a generic error message.
   */
  async logout(email: string): Promise<IResponse> {
    try {
      // Verify exist email
      const TOKEN_EXISTS = await this.redisService.existValue(email);

      if (!TOKEN_EXISTS)
        return responseFail({
          message: 'No se encontró ningún token asociado con este usuario.',
          state: false,
        });

      await this.redisService.delValue(email);

      return responseSucess({
        message: 'Cierre de sesión exitoso!.',
      });
    } catch (error) {
      return responseFail({
        message: 'Error en la solicitud.',
        state: false,
      });
    }
  }

  /**
   * Generates a JWT token for the given user ID and email.
   * @param {string} userId - The user's ID.
   * @param {string} email - The user's email.
   * @returns {string} The generated JWT token.
   */
  generateToken(userId: string, email: string): string {
    return this.jwtservice.sign(
      {
        userId,
        email,
      },
      {
        expiresIn: '1d',
        secret: process.env.JWT_TOKEN,
      },
    );
  }
}
