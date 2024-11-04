import { Module } from '@nestjs/common';
import { SessionUserService } from './cache-session-user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
                    },
                }),
            },
        ]),
        PrometheusModule,
    ],
    controllers: [SessionUserService],
    providers: [
        makeCounterProvider({
            name: 'PROM_METRIC_SESSION_SAVE_TOTAL',
            help: 'Total number of user session save requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_SESSION_SAVE_DURATION',
            help: 'Duration of user session save requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_SESSION_GET_TOTAL',
            help: 'Total number of user session get requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_SESSION_GET_DURATION',
            help: 'Duration of user session get requests',
        }),
        makeCounterProvider({
            name: 'PROM_METRIC_SESSION_DELETE_TOTAL',
            help: 'Total number of user session delete requests',
        }),
        makeHistogramProvider({
            name: 'PROM_METRIC_SESSION_DELETE_DURATION',
            help: 'Duration of user session delete requests',
        }),
    ],
})
export class SessionUserModule {}
