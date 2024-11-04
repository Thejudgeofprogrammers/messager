import { Module } from '@nestjs/common';
import { AuthorizeService } from './authorize.service';
import { AuthorizeController } from './authorize.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
    makeCounterProvider,
    makeHistogramProvider,
} from '@willsoto/nestjs-prometheus';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'AUTH_PACKAGE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: () => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'auth',
                        protoPath: 'src/protos/proto_files/auth.proto',
                        url: 'auth_microservice:50051',
                    },
                }),
            },
        ]),
    ],
    controllers: [AuthorizeController],
    providers: [
        AuthorizeService,
        makeCounterProvider({
            name: 'PROM_METRIC_AUTH_LOGIN_TOTAL',
            help: 'Total number of login requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_AUTH_LOGIN_DURATION',
            help: 'Duration of login requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_AUTH_REGISTER_TOTAL',
            help: 'Total number of register requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_AUTH_REGISTER_DURATION',
            help: 'Duration of register requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_AUTH_LOGOUT_TOTAL',
            help: 'Total number of logout requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_AUTH_LOGOUT_DURATION',
            help: 'Duration of logout requests',
        }),
    ],
})
export class AuthorizeModule {}
