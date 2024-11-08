import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: Types.ObjectId, required: true })
    message_id: Types.ObjectId; // ID сообщения

    @Prop({ type: Number, required: true })
    sender_id: number; // ID отправителя

    @Prop({ type: String, required: true })
    text: string; // Текст сообщения

    @Prop({ type: Date, required: true })
    timestamp: Date; // Дата отправки
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export type MessageDocument = Message & Document;
