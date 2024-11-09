import { MiddlewareConsumer, Module } from '@nestjs/common';
import { SessionMiddleware } from './session.middleware';
import { ClientGrpc, ClientProxyFactory } from '@nestjs/microservices';
import { SessionUserService } from 'src/protos/proto_gen_files/session_user';
import { grpcClientOptionsSessionUser } from 'src/config/grpc/grpc.options';
import { exludeRoutes } from 'src/config/exlude_route';

@Module({
    providers: [
        SessionMiddleware,
        {
            provide: 'SESSION_USER_SERVICE',
            useFactory: (clientGrpc: ClientGrpc) => {
                return clientGrpc.getService<SessionUserService>(
                    'SessionUserService',
                );
            },
            inject: ['SESSION_USER_CLIENT'],
        },
        {
            provide: 'SESSION_USER_CLIENT',
            useFactory: () => {
                return ClientProxyFactory.create(grpcClientOptionsSessionUser);
            },
        },
    ],
})
export class SessionModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SessionMiddleware)
            .exclude(...exludeRoutes)
            .forRoutes('*');
    }
}
