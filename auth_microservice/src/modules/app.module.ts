import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CryptModule } from './crypt/crypt.module';
import configuration from '../config/config.main';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../../config/auth.env',
            isGlobal: true,
            load: [configuration],
        }),
        AuthModule,
        CryptModule,
    ],
})
export class AppModule {}
