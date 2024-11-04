import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
    makeCounterProvider,
    makeHistogramProvider,
    PrometheusModule,
} from '@willsoto/nestjs-prometheus';
// configService: ConfigService
@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
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
        ]),
        PrometheusModule,
    ],
    controllers: [UserController],
    providers: [
        UserService,
        makeCounterProvider({
            name: 'PROM_METRIC_USER_FIND_BY_ID_TOTAL',
            help: 'Total number of find user by ID requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_USER_FIND_BY_ID_DURATION',
            help: 'Duration of find user by ID requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_USER_FIND_BY_TAG_TOTAL',
            help: 'Total number of find user by tag requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_USER_FIND_BY_TAG_DURATION',
            help: 'Duration of find user by tag requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_USER_FIND_BY_PHONE_TOTAL',
            help: 'Total number of find user by phone requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_USER_FIND_BY_PHONE_DURATION',
            help: 'Duration of find user by phone requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_USER_FIND_BY_EMAIL_TOTAL',
            help: 'Total number of find user by email requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_USER_FIND_BY_EMAIL_DURATION',
            help: 'Duration of find user by email requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_USER_FIND_BY_USERNAME_TOTAL',
            help: 'Total number of find user by username requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_USER_FIND_BY_USERNAME_DURATION',
            help: 'Duration of find user by username requests',
        }),
    ],
})
export class UserModule {}
