import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
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
                        package: configService.get<string>('grpc_auth_package'),
                        protoPath: configService.get<string>('grpc_auth_path'),
                        url: configService.get<string>('grpc_auth_url'),
                    },
                }),
            },
        ]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
