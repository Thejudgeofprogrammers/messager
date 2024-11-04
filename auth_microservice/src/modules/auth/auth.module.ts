import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptModule } from '../crypt/crypt.module';
import { TokenModule } from '../token/token.module';
import {
    makeCounterProvider,
    makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';
@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                name: 'SESSION_PACKAGE',
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
            {
                name: 'USER_PACKAGE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: () => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'user',
                        protoPath: 'protos/proto_files/user.proto',
                        url: 'user_microservice:50052',
                    },
                }),
            },
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                name: 'AUTH_PACKAGE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'auth',
                        protoPath: configService.get<string>('grpc_auth_path'),
                    },
                }),
            },
        ]),
        CryptModule,
        TokenModule,
    ],
    controllers: [AuthService],
    providers: [
        makeCounterProvider({
            name: 'PROM_METRIC_AUTH_LOGIN_TOTAL',
            help: 'Total number of logins',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_AUTH_LOGIN_DURATION',
            help: 'Duration of login requests',
        }),
    ],
})
export class AuthModule {}
