import { Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { errMessages } from 'src/common/messages';
import { StatusClient } from 'src/common/status';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('create')
    async createNewChat(@Res() res: Response) {
        try {
        } catch (e) {
            return res
                .json({ message: errMessages.createNewChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Get(':chatId')
    async getChatById(@Res() res: Response) {
        try {
        } catch (e) {
            return res
                .json({ message: errMessages.getChatById })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Get(':username')
    async getChatByChatName(@Res() res: Response) {
        try {
        } catch (e) {
            return res
                .json({ message: errMessages.getChatByChatName })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post('update/:chatId')
    async updateChatById(@Res() res: Response) {
        try {
        } catch (e) {
            return res
                .json({ message: errMessages.updateChatById })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post('delete/:chatId')
    async deleteChatById(@Res() res: Response) {
        try {
        } catch (e) {
            return res
                .json({ message: errMessages.deleteChatById })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Get(':userId')
    async getAllChats(@Res() res: Response) {
        try {
        } catch (e) {
            return res
                .json({ message: errMessages.getAllChats })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post(':chatId/add/:userId')
    async addUserToChat(@Res() res: Response) {
        try {
        } catch (e) {
            return res
                .json({ message: errMessages.addUserToChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post(':chatId/del/:userId')
    async RemoveUserFromChat(@Res() res: Response) {
        try {
        } catch (e) {
            return res
                .json({ message: errMessages.RemoveUserFromChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }
}
