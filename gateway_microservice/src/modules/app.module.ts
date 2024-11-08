import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthorizeModule } from './authorize/authorize.module';
import { SessionModule } from './session/session.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { UserModule } from './user/user.module';
import configuration from '../config/config.main';

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
        AuthorizeModule,
        SessionModule,
    ],
})
export class AppModule {}
