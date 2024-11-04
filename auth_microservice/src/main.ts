import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
    const grpcMicroserviceOptions: MicroserviceOptions = {
        transport: Transport.GRPC,
        options: {
            url: configService.get<string>('grpc_auth_url'),
            package: 'auth',
            protoPath: configService.get<string>('grpc_auth_path'),
        },
    };

    app.connectMicroservice(grpcMicroserviceOptions);

    await app.startAllMicroservices();
}

bootstrap();
