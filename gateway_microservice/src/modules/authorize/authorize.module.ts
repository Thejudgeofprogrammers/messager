import { Module } from '@nestjs/common';
import { AuthorizeService } from './authorize.service';
import { AuthorizeController } from './authorize.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'AUTH_PACKAGE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'auth',
                        protoPath: configService.get<string>('grpc_auth_path'),
                        url: configService.get<string>('grpc_auth_url'),
                    },
                }),
            },
        ]),
    ],
    providers: [AuthorizeService],
    controllers: [AuthorizeController],
})
export class AuthorizeModule {}
