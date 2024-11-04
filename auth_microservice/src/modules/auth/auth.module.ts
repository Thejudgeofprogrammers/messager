import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptModule } from '../crypt/crypt.module';
import { TokenModule } from '../token/token.module';
import {
    makeCounterProvider,
    makeHistogramProvider,
    PrometheusModule,
} from '@willsoto/nestjs-prometheus';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                name: 'SESSION_PACKAGE',
                useFactory: () => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'session_user',
                        protoPath: 'src/protos/proto_files/session_user.proto',
                        url: 'session_microservice:50053',
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
                        protoPath: 'src/protos/proto_files/user.proto',
                        url: 'user_microservice:50052',
                    },
                }),
            },
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                name: 'AUTH_PACKAGE',
                useFactory: () => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'auth',
                        protoPath: 'src/protos/proto_files/auth.proto',
                    },
                }),
            },
        ]),
        CryptModule,
        TokenModule,
        PrometheusModule,
    ],
    controllers: [AuthService],
    providers: [
        makeCounterProvider({
            name: 'PROM_METRIC_AUTH_LOGIN_TOTAL',
            help: 'Total number of logins',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_AUTH_LOGIN_FAILURE_TOTAL',
            help: 'Total number of failed login attempts',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_AUTH_LOGIN_DURATION',
            help: 'Duration of login requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_AUTH_REGISTER_DURATION',
            help: 'Duration of registration requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_AUTH_REGISTER_TOTAL',
            help: 'Total number of registrations',
        }),
    ],
})
export class AuthModule {}
