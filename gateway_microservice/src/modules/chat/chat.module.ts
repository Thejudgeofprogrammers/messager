import { Module } from '@nestjs/common';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { prometheusProvidersChat } from 'src/config/metrics/metrics.prometheus_chat';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserService } from '../user/user.service';

@Module({
    imports: [PrometheusModule],
    controllers: [ChatController],
    providers: [UserService, ChatService, ...prometheusProvidersChat],
})
export class ChatModule {}
