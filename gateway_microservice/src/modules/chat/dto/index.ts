import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class LastMessage {
    @IsString()
    messageId: string;

    @IsNumber()
    senderId: number;

    @IsString()
    preview: string;
}

export class ChatParticipant {
    @IsNumber()
    userId: number;

    @IsString()
    role: string;
}

export class Message {
    @IsString()
    messageId: string;

    @IsNumber()
    senderId: number;

    @IsString()
    text: string;

    @IsDate()
    timestamp: Date | undefined;
}

export class LoadToChatRequestDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;
}

export class LoadToChatResponseDTO {
    @ApiProperty({
        example: 'Успешно добавлен в чат',
        description: 'Пользователь добавился в чат',
    })
    @IsString()
    message: string;
}

export class LeaveToChatRequestDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;
}

export class LeaveToChatResponseDTO {
    @ApiProperty({
        example: 'Успешно добавлен в чат',
        description: 'Пользователь добавился в чат',
    })
    @IsString()
    message: string;
}

export class CreateNewChatRequestDTO {
    @ApiProperty({
        example: 'yourChat',
        description: 'Имя чата',
    })
    @IsString()
    chatName: string;

    @ApiProperty({
        example: 'private',
        description: 'Тип чата',
    })
    @IsString()
    chatType: string;
}

export class CreateNewChatResponseDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;
}

export class GetChatByIdRequestDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;
}

export class GetChatByIdResponseDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;

    @ApiProperty({
        example: 'yourChat',
        description: 'Имя чата',
    })
    @IsString()
    chatName: string;

    @ApiProperty({
        example: 'private',
        description: 'Тип чата',
    })
    @IsString()
    chatType: string;

    @ApiProperty({
        example: {
            messageId: '6734bbd9d271a4f8cc0874ac',
            senderId: 12,
            preview: 'Всем привет',
        },
        description: 'Тип чата',
    })
    lastMessage: LastMessage | undefined;

    @ApiProperty({
        example: [{ userId: 12, role: 'owner' }],
        description: 'Список пользователей',
    })
    participants: ChatParticipant[];

    @ApiProperty({
        example: [
            {
                messageId: '6734bbd9d271a4f8cc0874ac',
                senderId: 12,
                text: 'Всем привет',
                timestamp: '1731436006',
            },
        ],
        description: 'Список пользователей',
    })
    messages: Message[];

    @ApiProperty({
        example: '1731436006',
        description: 'Время создания чата',
    })
    @IsDate()
    @IsOptional()
    createdAt: Date | undefined;
}

export class GetChatByChatNameRequestDTO {
    @ApiProperty({
        example: 'yourChat',
        description: 'Имя чата',
    })
    @IsString()
    chatName: string;
}

export class GetChatByChatNameResponseDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;

    @ApiProperty({
        example: 'yourChat',
        description: 'Имя чата',
    })
    @IsString()
    chatName: string;
}

export class UpdateChatByIdRequestDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;

    @ApiProperty({
        example: 'yourChat',
        description: 'Имя чата',
    })
    @IsString()
    @IsOptional()
    chatName: string | undefined;

    @ApiProperty({
        example: 'private',
        description: 'Тип чата',
    })
    @IsString()
    @IsOptional()
    chatType: string | undefined;

    @ApiProperty({
        example: 'В этом чате публикуются товары',
        description: 'Информация о чате',
    })
    @IsString()
    @IsOptional()
    description: string | undefined;
}

export class UpdateChatByIdResponseDTO {
    @ApiProperty({
        example: 'Данные изменены',
        description: 'Изменения данных о чате',
    })
    @IsString()
    message: string;
}

export class DeleteChatByIdRequestDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;
}

export class DeleteChatByIdResponseDTO {
    @ApiProperty({
        example: 'Чат удалён',
        description: 'Удаление чате успешное.',
    })
    @IsString()
    message: string;
}

export class AddUserToChatRequestDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;

    @ApiProperty({
        example: { userId: 12, role: 'owner' },
        description: 'Новый пользователь',
    })
    participant: ChatParticipant;
}

export class AddUserToChatResponsetDTO {
    @ApiProperty({
        example: 'Пользователь добавлен',
        description: 'Успешно добавлен пользователь в чат',
    })
    @IsString()
    message: string;
}

export class RemoveUserFromChatRequestDTO {
    @ApiProperty({
        example: '6733bbd9d271a4f8cc0874ac',
        description: 'chatId - id чата',
    })
    @IsString()
    chatId: string;

    @ApiProperty({
        example: 12,
        description: 'chatId - id чата',
    })
    @IsNumber()
    userId: number;
}

export class RemoveUserFromChatResponseDTO {
    @ApiProperty({
        example: 'Пользователь удалён из чата',
        description: 'Успешно удалён из чата пользователь',
    })
    @IsString()
    message: string;
}