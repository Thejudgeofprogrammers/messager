import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptModule } from '../crypt/crypt.module';
import { TokenModule } from '../token/token.module';

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
                imports: [ConfigModule],
                inject: [ConfigService],
                name: 'USER_PACKAGE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: 'user',
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
})
export class AuthModule {}
