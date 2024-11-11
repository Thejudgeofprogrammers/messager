import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { prometheusProvidersUser } from 'src/config/metrics/metrics.prometheus_user';

@Module({
    imports: [PrometheusModule],
    controllers: [UserController],
    providers: [UserService, ...prometheusProvidersUser],
    exports: [UserService],
})
export class UserModule {}
