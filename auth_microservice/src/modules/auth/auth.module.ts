import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CryptService } from '../crypt/crypt.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';

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
                        url: configService.get<string>('grpc_session_url'),
                    },
                }),
            },
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                name: 'USER_PACKAGE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: configService.get<string>('grpc_user_package'),
                        protoPath: configService.get<string>('grpc_user_path'),
                        url: configService.get<string>('grpc_user_url'),
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
                        package: configService.get<string>('grpc_auth_package'),
                        protoPath: configService.get<string>('grpc_auth_path'),
                    },
                }),
            },
        ]),
        CryptService,
        TokenService,
    ],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
