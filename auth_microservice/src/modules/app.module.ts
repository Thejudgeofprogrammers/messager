import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CryptModule } from './crypt/crypt.module';
import configuration from '../config/config.main';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { TokenModule } from './token/token.module';

@Module({
    imports: [
        PrometheusModule.register({
            defaultLabels: {
                app: 'telegramm',
            },
        }),
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
            load: [configuration],
        }),
        AuthModule,
        CryptModule,
        TokenModule,
    ],
})
export class AppModule {}
