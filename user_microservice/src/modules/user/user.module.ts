import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                imports: [ConfigModule],
                inject: [ConfigService],
                name: 'USER_PACKAGE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.GRPC,
                    options: {
                        package: configService.get<string>('grpc_user_package'),
                        protoPath: configService.get<string>('grpc_user_path'),
                    },
                }),
            },
        ]),
        PrismaService,
    ],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
