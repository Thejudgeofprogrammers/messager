import {
    Controller,
    ForbiddenException,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './schemas/Chat';
import {
    ChatParticipant,
    ChatParticipantDocument,
} from './schemas/ChatParticipant';
import { Model, Types } from 'mongoose';
import { GrpcMethod } from '@nestjs/microservices';
import {
    AddUserToChatRequest,
    AddUserToChatResponse,
    CreateNewChatRequest,
    CreateNewChatResponse,
    DeleteChatByIdRequest,
    DeleteChatByIdResponse,
    GetChatByChatNameRequest,
    GetChatByChatNameResponse,
    GetChatByIdRequest,
    GetChatByIdResponse,
    RemoveUserFromChatRequest,
    RemoveUserFromChatResponse,
} from 'src/protos/proto_gen_files/chat';
import { Message, MessageDocument } from './schemas/Message';

@Controller('ChatService')
export class ChatService {
    private readonly logger = new Logger(ChatService.name);

    constructor(
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
        @InjectModel(ChatParticipant.name)
        private readonly chatParticipantModel: Model<ChatParticipantDocument>,
        @InjectModel(Message.name)
        private readonly messageModel: Model<MessageDocument>,
    ) {}

    @GrpcMethod('ChatService', 'CreateNewChat')
    async CreateNewChat(
        payload: CreateNewChatRequest,
    ): Promise<CreateNewChatResponse> {
        try {
            const { chatName, chatType, userId } = payload;
            let pre;
            if (chatName.length > 10) {
                pre = chatName.substring(0, 10).trim() + '...';
            } else {
                pre = `Чат ${chatName} создан`;
            }

            const chatParticipantData: ChatParticipant = {
                user_id: userId,
                role: 'owner',
            };

            const newParticipant =
                await this.chatParticipantModel.create(chatParticipantData);

            const messageData: Message = {
                text: `Чат ${chatName} создан`,
                sender_id: userId,
            };

            const newMessage = await this.messageModel.create(messageData);

            if (!newParticipant || !newMessage) {
                throw new InternalServerErrorException('Data Base exception');
            }

            const chatData = {
                chatName,
                chatType,
                lastMessage: {
                    message_id: newMessage._id,
                    sender_id: userId,
                    preview: pre,
                },
                participants: [newParticipant._id],
                messages: [newMessage._id],
            };

            const newChat = await this.chatModel.create(chatData);

            if (!newChat) {
                throw new InternalServerErrorException('Data Base exception');
            }

            return { chatId: newChat._id.toString() };
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при создании чата',
            );
        }
    }

    @GrpcMethod('ChatService', 'GetChatById')
    async GetChatById(
        payload: GetChatByIdRequest,
    ): Promise<GetChatByIdResponse> {
        try {
            if (!payload.chatId || !Types.ObjectId.isValid(payload.chatId)) {
                throw new Error('Invalid or missing chatId in payload');
            }
            const validId = new Types.ObjectId(payload.chatId);
            const data = await this.chatModel
                .findById(validId)
                .populate('participants')
                .populate('messages')
                .exec();

            if (!data) {
                throw new Error(`Chat with ID ${validId} not found`);
            }

            const chatData = {
                chatId: data._id.toString(),
                chatName: data.chatName,
                chatType: data.chatType,
                lastMessage: data.lastMessage
                    ? {
                          messageId: data.lastMessage.message_id.toString(),
                          senderId: +data.lastMessage.sender_id,
                          preview: data.lastMessage.preview,
                      }
                    : undefined,
                createdAt: data.createdAt,
                participants: data.participants.map((participant: any) => ({
                    userId: participant.user_id,
                    role: participant.role,
                })),
                messages: data.messages.map((message: any) => ({
                    messageId: message._id.toString(),
                    senderId: message.sender_id,
                    text: message.text,
                    timestamp: message.createdAt,
                })),
            };
            return { chatData };
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при поиске чата по Id',
            );
        }
    }

    @GrpcMethod('ChatService', 'GetChatByChatName')
    async GetChatByChatName(
        payload: GetChatByChatNameRequest,
    ): Promise<GetChatByChatNameResponse> {
        try {
            const data = await this.chatModel
                .find({
                    chatName: payload.chatName,
                })
                .exec();
            if (!data) {
                throw new Error('Chat not found');
            }
            const chatDataArray = data.map((chat) => ({
                chatId: chat._id.toString(),
                chatName: chat.chatName,
            }));
            return { chatData: chatDataArray };
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при поиске чата по Имени',
            );
        }
    }

    @GrpcMethod('ChatService', 'UpdateChatById')
    async UpdateChatById() {
        try {
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при обновлении чата',
            );
        }
    }

    @GrpcMethod('ChatService', 'DeleteChatById')
    async DeleteChatById(
        payload: DeleteChatByIdRequest,
    ): Promise<DeleteChatByIdResponse> {
        try {
            const validId = new Types.ObjectId(payload.chatId);
            const chat = await this.chatModel
                .findById(validId)
                .populate('participants')
                .exec();

            if (!chat) {
                throw new NotFoundException('Чат не найден');
            }

            const chatParticipantArray = (chat as any).participants;

            const findOwner = chatParticipantArray.find(
                (user: ChatParticipant) => user.role === 'owner',
            );

            const { user_id } = findOwner;
            if (user_id !== payload.userId) {
                throw new ForbiddenException(
                    'Недостаточно прав для удаления чата',
                );
            }

            const chatDel = await this.chatModel.findByIdAndDelete(validId);

            if (chatDel) {
                await this.messageModel.deleteMany({
                    _id: { $in: chat.messages },
                });
                await this.chatParticipantModel.deleteMany({
                    _id: { $in: chat.participants },
                });
            }

            const participantsArray = chatParticipantArray.map(
                (participant: ChatParticipant) => participant.user_id,
            );

            const resp = {
                response: {
                    message: `Чат ${chat.chatName} удалён`,
                    status: 200,
                },
                info: {
                    chatId: payload.chatId.toString(),
                    data: participantsArray,
                },
            };

            console.log(`resp`);
            console.log(resp);

            return resp;
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при удалении чата',
            );
        }
    }

    @GrpcMethod('ChatService', 'AddUserToChat')
    async AddUserToChat(
        payload: AddUserToChatRequest,
    ): Promise<AddUserToChatResponse> {
        try {
            const chat = await this.chatModel.findById(
                new Types.ObjectId(payload.chatId),
            );
            if (!chat) {
                throw new InternalServerErrorException('Чат не найден');
            }

            const userExists = chat.participants.some(
                (participant) =>
                    participant.toString() === payload.participant.toString(),
            );
            if (userExists) {
                throw new InternalServerErrorException(
                    'Пользователь уже в чате',
                );
            }

            const newParticipant = new this.chatParticipantModel({
                user_id: payload.participant.userId,
                role: payload.participant.role,
            });

            await newParticipant.save();

            chat.participants.push(newParticipant._id as Types.ObjectId);
            await chat.save();

            return {
                response: {
                    message: 'Пользователь успешно добавлен в чат',
                    status: 200,
                },
            };
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при добавлении пользователя в чат',
            );
        }
    }

    @GrpcMethod('ChatService', 'RemoveUserFromChat')
    async RemoveUserFromChat(
        payload: RemoveUserFromChatRequest,
    ): Promise<RemoveUserFromChatResponse> {
        try {
            const chat = await this.chatModel.findById(payload.chatId);
            if (!chat) {
                throw new InternalServerErrorException('Чат не найден');
            }

            const participantIndex = chat.participants.findIndex(
                (participant) =>
                    participant.toString() === payload.userId.toString(),
            );
            if (participantIndex === -1) {
                throw new InternalServerErrorException(
                    'Пользователь не найден в чате',
                );
            }

            chat.participants.splice(participantIndex, 1);
            await chat.save();

            return {
                response: {
                    message: 'Пользователь успешно удален из чата',
                    status: 200,
                },
            };
        } catch (e) {
            this.logger.error(
                `Ошибка при создании чата: ${e.message}`,
                e.stack,
            );
            throw new InternalServerErrorException(
                'Произошла ошибка при удалении пользователя из чата',
            );
        }
    }
}
