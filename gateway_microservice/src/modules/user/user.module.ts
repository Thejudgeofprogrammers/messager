import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'USER_PACKAGE',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: configService.get<string>('grpc_user_package'),
                        protoPath: configService.get<string>('grpc_user_path'),
                        url: configService.get<string>('grpc_user_url'),
                    },
                }),
            },
        ]),
    ],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
