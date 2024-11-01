import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import configuration from '../config/config.main';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../../config/user.env',
            isGlobal: true,
            load: [configuration],
        }),
        UserModule,
        PrismaModule,
    ],
})
export class AppModule {}
