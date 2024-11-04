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
                useFactory: () => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'session_user',
                        protoPath: 'src/protos/proto_files/session_user.proto',
                        url: 'session_microservice:50053',
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
