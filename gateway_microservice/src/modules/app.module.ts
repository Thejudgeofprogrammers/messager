import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/config.main';
import { AuthorizeModule } from './authorize/authorize.module';
import { SessionModule } from './session/session.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '../../.env',
            isGlobal: true,
            load: [configuration],
        }),
        AuthorizeModule,
        SessionModule,
    ],
})
export class AppModule {}
