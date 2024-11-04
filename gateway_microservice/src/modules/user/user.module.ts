import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
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
                        protoPath: 'protos/proto_files/user.proto',
                        url: 'user_microservice:50052',
                    },
                }),
            },
        ]),
    ],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
