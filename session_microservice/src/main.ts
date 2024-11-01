import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const grpcMicroserviceOptions: MicroserviceOptions = {
        transport: Transport.GRPC,
        options: {
            package: configService.get<string>('grpc_session_package'),
            protoPath: configService.get<string>('grpc_session_main_path'),
            url: configService.get<string>('grpc_session_url'),
        },
    };

    app.connectMicroservice(grpcMicroserviceOptions);

    await app.startAllMicroservices();
}

bootstrap();
