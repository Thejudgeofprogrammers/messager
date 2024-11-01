import { Module } from '@nestjs/common';
import { CacheSessionUserService } from './cache-session-user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
                        package: configService.get<string>(
                            'grpc_session_package',
                        ),
                        protoPath:
                            configService.get<string>('grpc_session_path'),
                    },
                }),
            },
        ]),
    ],
    providers: [CacheSessionUserService],
    exports: [CacheSessionUserService],
})
export class CacheSessionUserModule {}
