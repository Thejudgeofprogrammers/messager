import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import configuration from '../config/config.main';
import { PrismaModule } from './prisma/prisma.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

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
        UserModule,
        PrismaModule,
    ],
})
export class AppModule {}
