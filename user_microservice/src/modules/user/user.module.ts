import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module';
import {
    makeCounterProvider,
    makeHistogramProvider,
    PrometheusModule,
} from '@willsoto/nestjs-prometheus';

//configService: ConfigService
@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                name: 'USER_PACKAGE',
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
        PrismaModule,
        PrometheusModule,
    ],
    controllers: [UserService],
    providers: [
        makeCounterProvider({
            name: 'PROM_METRIC_USER_CREATE_TOTAL',
            help: 'Total number of user creation requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_USER_CREATE_DURATION',
            help: 'Duration of user creation requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_USER_FIND_TOTAL',
            help: 'Total number of user find requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_USER_FIND_DURATION',
            help: 'Duration of user find requests',
        }),
    ],
})
export class UserModule {}
