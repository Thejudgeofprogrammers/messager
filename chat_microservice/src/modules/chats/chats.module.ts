import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/Chat';
import { Message, MessageSchema } from './schemas/Message';
import { ChatService } from './chats.service';
import {
    ChatParticipant,
    ChatParticipantSchema,
} from './schemas/ChatParticipant';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Chat.name, schema: ChatSchema },
            { name: ChatParticipant.name, schema: ChatParticipantSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
    ],
    controllers: [ChatService],
})
export class ChatModule {}
