import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { errMessages } from 'src/common/messages';
import { StatusClient } from 'src/common/status';
import { ChatService } from './chat.service';
import { RequirePayload } from 'src/common/decorators/requirePayload';
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
    LeaveFromChatRequest,
    LeaveFromChatResponse,
    LoadToChatRequest,
    LoadToChatResponse,
    RemoveUserFromChatRequest,
    RemoveUserFromChatResponse,
    UpdateChatByIdRequest,
    UpdateChatByIdResponse,
} from 'src/protos/proto_gen_files/chat';
import { RequireQueryPayload } from 'src/common/decorators/requireQueryPayload';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post(':chatId/join/:userId')
    @RequirePayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async loadToChat(
        @Body() payload: { chatId: string },
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<LoadToChatResponse>> {
        try {
            const userId = +req.cookies['userId'];
            const updatedPayload: LoadToChatRequest = { ...payload, userId };
            const methodData =
                await this.chatService.LoadToChat(updatedPayload);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .status(methodData.response.status)
                .json(methodData.response.message);
        } catch (e) {
            return res
                .json({ message: errMessages.loadToChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post(':chatId/leave/:userId')
    @RequirePayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async leaveFromChat(
        @Body() payload: { chatId: string },
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<LeaveFromChatResponse>> {
        try {
            const userId = +req.cookies['userId'];
            const updatedPayload: LeaveFromChatRequest = { ...payload, userId };
            const methodData =
                await this.chatService.LeaveFromChat(updatedPayload);

            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .status(methodData.response.status)
                .json(methodData.response.message);
        } catch (e) {
            return res
                .json({ message: errMessages.leaveFromChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post('create')
    @RequirePayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async createNewChat(
        @Body() payload: Omit<CreateNewChatRequest, 'userId'>,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<CreateNewChatResponse>> {
        try {
            const userId = +req.cookies['userId'];
            const updatedPayload: CreateNewChatRequest = { ...payload, userId };
            const methodData =
                await this.chatService.CreateNewChat(updatedPayload);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .status(StatusClient.HTTP_STATUS_OK.status)
                .json(methodData.chatId);
        } catch (e) {
            return res
                .json({ message: errMessages.createNewChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Get(':chatId')
    @RequireQueryPayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async getChatById(
        @Query() data: GetChatByIdRequest,
        @Res() res: Response,
    ): Promise<Response<GetChatByIdResponse>> {
        try {
            const methodData = await this.chatService.GetChatById(data);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .status(StatusClient.HTTP_STATUS_OK.status)
                .json(methodData.chatData);
        } catch (e) {
            return res
                .json({ message: errMessages.getChatById })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Get(':username')
    @RequireQueryPayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async getChatByChatName(
        @Query() data: GetChatByChatNameRequest,
        @Res() res: Response,
    ): Promise<Response<GetChatByChatNameResponse>> {
        try {
            const methodData = await this.chatService.GetChatByChatName(data);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .status(StatusClient.HTTP_STATUS_OK.status)
                .json(methodData.chatData);
        } catch (e) {
            return res
                .json({ message: errMessages.getChatByChatName })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post('update/:chatId')
    @RequirePayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async updateChatById(
        @Body() payload: UpdateChatByIdRequest,
        @Res() res: Response,
    ): Promise<Response<UpdateChatByIdResponse>> {
        try {
            const methodData = await this.chatService.UpdateChatById(payload);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .json(methodData.response.message)
                .status(methodData.response.status);
        } catch (e) {
            return res
                .json({ message: errMessages.updateChatById })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post('delete/:chatId')
    @RequirePayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async deleteChatById(
        @Body() payload: DeleteChatByIdRequest,
        @Res() res: Response,
    ): Promise<Response<DeleteChatByIdResponse>> {
        try {
            const methodData = await this.chatService.DeleteChatById(payload);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .json(methodData.response.message)
                .status(methodData.response.status);
        } catch (e) {
            return res
                .json({ message: errMessages.deleteChatById })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post(':chatId/add/:userId')
    @RequirePayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async addUserToChat(
        @Body() payload: AddUserToChatRequest,
        @Res() res: Response,
    ): Promise<Response<AddUserToChatResponse>> {
        try {
            const methodData = await this.chatService.AddUserToChat(payload);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .json(methodData.response.message)
                .status(methodData.response.status);
        } catch (e) {
            return res
                .json({ message: errMessages.addUserToChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post(':chatId/del/:userId')
    @RequirePayload(StatusClient.HTTP_STATUS_BAD_REQUEST)
    async RemoveUserFromChat(
        @Body() payload: RemoveUserFromChatRequest,
        @Res() res: Response,
    ): Promise<Response<RemoveUserFromChatResponse>> {
        try {
            const methodData =
                await this.chatService.RemoveUserFromChat(payload);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .json(methodData.response.message)
                .status(methodData.response.status);
        } catch (e) {
            return res
                .json({ message: errMessages.removeUserFromChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }
}
