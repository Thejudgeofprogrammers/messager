import { Module } from '@nestjs/common';
import { AuthorizeService } from './authorize.service';
import { AuthorizeController } from './authorize.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { prometheusProvidersAuth } from 'src/config/metrics/metrics.prometheus_auth';
import { UserService } from '../user/user.service';

@Module({
    imports: [PrometheusModule],
    controllers: [AuthorizeController],
    providers: [UserService, AuthorizeService, ...prometheusProvidersAuth],
})
export class AuthorizeModule {}
