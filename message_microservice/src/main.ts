import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { grpcClientOptionsMessager } from './config/grpc.options_messager';
// import { kafkaMicroservice } from './config/kafka.options_messager';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.connectMicroservice(grpcClientOptionsMessager);
    // app.connectMicroservice(kafkaMicroservice);
    await app.startAllMicroservices();
}

bootstrap();
