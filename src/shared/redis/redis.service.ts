import { Inject, Injectable } from '@nestjs/common';

import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  /**
   * Constructs a new instance of the RedisService.
   * @param {Redis.Redis} redisClient - The Redis client instance.
   */
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis,
  ) {}

  /**
   * Sets a value in Redis.
   * @param {string} key - The key to set.
   * @param {string} value - The value to set.
   * @returns {Promise<void>} A promise indicating the completion of the operation.
   */
  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  /**
   * Retrieves a value from Redis based on the provided key.
   * @param {string} key - The key to retrieve the value for.
   * @returns {Promise<string|null>} A promise that resolves to the value associated with the key,
   * or null if the key does not exist.
   */
  async getValue(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  /**
   * Checks if a value exists in Redis based on the provided key.
   * @param {string} key - The key to check for existence.
   * @returns {Promise<boolean>} A promise that resolves to true if the key exists in Redis, otherwise false.
   */
  async existValue(key: string): Promise<boolean> {
    const PROPERTY_EXIST = await this.redisClient.exists(key);
    return PROPERTY_EXIST > 0 ? true : false;
  }

  /**
   * Deletes a value from Redis based on the provided key.
   * @param {string} key - The key of the value to delete.
   * @returns {Promise<boolean>} A promise that resolves to the number of keys that were removed.
   */
  async delValue(key: string): Promise<boolean> {
    const PROPERTY_DEL = await this.redisClient.del(key);
    return PROPERTY_DEL > 0 ? true : false;
  }
}
