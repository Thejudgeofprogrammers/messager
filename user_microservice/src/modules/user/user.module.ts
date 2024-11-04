import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module';

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
                        protoPath: '/app/protos/proto_files/user.proto',
                        url: 'user_microservice:50052',
                    },
                }),
            },
        ]),
        PrismaModule,
    ],
    controllers: [UserService],
})
export class UserModule {}
