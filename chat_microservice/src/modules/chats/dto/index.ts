import { Types } from 'mongoose';

export interface LastMessage {
    message_id: Types.ObjectId;
    sender_id: number;
    preview: string;
}
