import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/config.main';
import { AuthModule } from './auth/auth.module';
import { SessionModule } from './session/session.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
            load: [configuration],
        }),
        AuthModule,
        SessionModule,
    ],
})
export class AppModule {}
