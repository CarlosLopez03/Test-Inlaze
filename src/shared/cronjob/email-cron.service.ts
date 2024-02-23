import { Injectable, OnModuleInit } from '@nestjs/common';

import { CronJob } from 'cron';

import { RedisService } from '../redis/redis.service';
import { NodemailerService } from '../mail/nodemailer.service';

@Injectable()
export class EmailCronService implements OnModuleInit {
  constructor(
    private redisService: RedisService,
    private mailService: NodemailerService,
  ) {}

  /**
   * Automatically invoked when the module is initialized.
   * Schedules the cron job to process the email queue.
   */
  onModuleInit() {
    this.scheduleCronJob();
  }

  /**
   * Sets up and starts the cron job to process the email queue.
   */
  scheduleCronJob() {
    // Config cron for one minute
    const CRON_EXPRESSION = '*/10 * * * * *';
    const CRON_JOB = new CronJob(CRON_EXPRESSION, async () => {
      await this.processEmailQueue();
    });

    CRON_JOB.start();
  }

  /**
   * Processes the email queue by sending confirmation emails.
   */
  async processEmailQueue() {
    try {
      // Extract emils in redis
      const EMAILS = await this.redisService.extractToQueue();

      if (!EMAILS.length) return;

      // Define lot size
      const BATCH_SIZE = 10;

      // Divide the emails into batching lots batchsize and process each lot
      for (let index = 0; index < EMAILS.length; index += BATCH_SIZE) {
        const BATCH = EMAILS?.slice(index, index + BATCH_SIZE);

        // Send confirmation email for each email in the batch
        await Promise.all(
          BATCH.map(async (email) => {
            await this.mailService.sendConfirmationEmail(email);
          }),
        );

        // Delete the sent emails from the Redis queue
        await this.redisService.deleteToQueue(BATCH?.length, BATCH?.join(' '));
      }
    } catch (error) {
      return error;
    }
  }
}
