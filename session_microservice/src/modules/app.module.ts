import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/config.main';
import { CacheSessionUserModule } from './cache-session-user/cache-session-user.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
            load: [configuration],
        }),
        CacheSessionUserModule,
    ],
})
export class AppModule {}
