import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { grpcClientOptionsMessager } from './config/grpc.options_messager';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.connectMicroservice(grpcClientOptionsMessager);

    await app.listen(3001, () => {
        Logger.log('HTTP server started on http://localhost:3001');
    });

    await app.startAllMicroservices();
}

bootstrap();
