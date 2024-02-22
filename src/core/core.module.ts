import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PublicationsModule } from './publications/publications.module';

@Module({ imports: [UsersModule, AuthModule, PublicationsModule] })
export class CoreModule {}
