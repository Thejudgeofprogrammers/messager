import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Message {
    @Prop({ type: Number, required: true })
    sender_id: number; // ID отправителя

    @Prop({ type: String, required: true })
    text: string; // Текст сообщения
}

export const MessageSchema = SchemaFactory.createForClass(Message);
export type MessageDocument = Message & Document;
