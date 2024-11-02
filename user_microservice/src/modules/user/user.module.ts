import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from '../prisma/prisma.module';

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
                        package: 'user',
                        protoPath: configService.get<string>('grpc_user_path'),
                    },
                }),
            },
        ]),
        PrismaModule,
    ],
    controllers: [UserService],
})
export class UserModule {}
