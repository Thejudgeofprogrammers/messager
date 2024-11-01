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
            package: configService.get<string>('grpc_user_package'),
            protoPath: configService.get<string>('grpc_user_path_main'),
            url: configService.get<string>('grpc_user_url'),
        },
    };

    app.connectMicroservice(grpcMicroserviceOptions);

    await app.startAllMicroservices();
}

bootstrap();
