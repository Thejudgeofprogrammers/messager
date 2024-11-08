import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { LastMessage } from '../dto';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
    @Prop({ type: String })
    chatName: string; // Имя чата (если групповой)

    @Prop({ type: String, required: true })
    chatType: string; // Тип чата: 'group' или 'private'

    // Последнее сообщение
    @Prop({
        type: {
            message_id: Types.ObjectId,
            sender_id: Number,
            preview: String,
        },
    })
    lastMessage: LastMessage;

    @Prop({ type: [Types.ObjectId], ref: 'ChatParticipant' }) // Список участников ссылается на коллекцию ChatParticipant
    participants: Types.ObjectId[];

    @Prop({ type: Date })
    createdAt: Date;

    @Prop({ type: [Types.ObjectId], ref: 'Message', default: [] }) // Сообщения ссылаются на коллекцию Message
    messages: Types.ObjectId[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
