import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { ConfigService } from '@nestjs/config';
import { ReflectionService } from '@grpc/reflection';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // const configService = app.get(ConfigService);
    app.useLogger(['error', 'warn', 'log', 'debug', 'verbose']);
    const grpcMicroserviceOptions: MicroserviceOptions = {
        transport: Transport.GRPC,
        options: {
            url: 'auth_microservice:50051',
            package: 'auth',
            protoPath: 'src/protos/proto_files/auth.proto',
            onLoadPackageDefinition: (pkg, server) => {
                new ReflectionService(pkg).addToServer(server);
            },
        },
    };

    app.connectMicroservice(grpcMicroserviceOptions);

    await app.startAllMicroservices();
}

bootstrap();
