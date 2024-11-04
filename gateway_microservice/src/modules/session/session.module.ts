import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SessionMiddleware } from './session.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'SESSION_PACKAGE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'session_user',
                        protoPath:
                            configService.get<string>('grpc_session_path'),
                        url: configService.get<string>('grpc_session_url'),
                    },
                }),
            },
        ]),
    ],
    providers: [SessionMiddleware],
})
export class SessionModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SessionMiddleware)
            .exclude('/api/auth/login', '/api/auth/register')
            .forRoutes('*');
    }
}
