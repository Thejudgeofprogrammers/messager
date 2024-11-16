import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Req,
    Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { errMessages } from 'src/common/messages';
import { StatusClient } from 'src/common/status';
import { ChatService } from './chat.service';
import {
    CreateNewChatRequest,
    DeleteChatByIdRequest,
    LeaveFromChatRequest,
    LoadToChatRequest,
} from 'src/protos/proto_gen_files/chat';
import {
    ApiBody,
    ApiCookieAuth,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import {
    AddUserToChatRequestDTO,
    AddUserToChatResponsetDTO,
    CreateNewChatRequestDTO,
    CreateNewChatResponseDTO,
    DeleteChatByIdRequestDTO,
    DeleteChatByIdResponseDTO,
    GetChatByChatNameRequestDTO,
    GetChatByChatNameResponseDTO,
    GetChatByIdRequestDTO,
    GetChatByIdResponseDTO,
    LeaveToChatRequestDTO,
    LeaveToChatResponseDTO,
    LoadToChatRequestDTO,
    LoadToChatResponseDTO,
    RemoveUserFromChatRequestDTO,
    RemoveUserFromChatResponseDTO,
    UpdateChatByIdRequestDTO,
    UpdateChatByIdResponseDTO,
} from './dto';
import {
    addUserToChatDocs,
    CreateNewChatDocs,
    deleteChatByIdDocs,
    FindByIdDocs,
    getChatByChatNameDocs,
    JoinChatDocs,
    LeaveChatDocs,
    removeUserFromChatDocs,
    updateChatByIdDocs,
} from 'src/common/api/chat';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post(':chatId/join/:userId')
    @ApiOperation({
        summary: 'Добавить чат на аккаунт',
        description: JoinChatDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Пользователь вошёл с аккаунта',
        type: LoadToChatResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для входа',
        type: LoadToChatRequestDTO,
    })
    async loadToChat(
        @Body() payload: LoadToChatRequestDTO,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<LoadToChatResponseDTO>> {
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
                .json(methodData.response.message)
                .status(methodData.response.status);
        } catch (e) {
            return res
                .json({ message: errMessages.loadToChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post(':chatId/leave/:userId')
    @ApiOperation({
        summary: 'Выход из чата',
        description: LeaveChatDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Пользователь вышел с аккаунта',
        type: LeaveToChatResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован',
    })
    @ApiResponse({
        status: 404,
        description: 'Ресурс не найден',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для выхода',
        type: LeaveToChatRequestDTO,
    })
    async leaveFromChat(
        @Body() payload: LeaveToChatRequestDTO,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<LeaveToChatResponseDTO>> {
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
                .json(methodData.response.message)
                .status(methodData.response.status);
        } catch (e) {
            return res
                .json({ message: errMessages.leaveFromChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post('create')
    @ApiOperation({
        summary: 'Создание чата',
        description: CreateNewChatDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 201,
        description: 'Пользователь создал чат',
        type: CreateNewChatResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для создания чата',
        type: CreateNewChatRequestDTO,
    })
    async createNewChat(
        @Body() payload: CreateNewChatRequestDTO,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<CreateNewChatResponseDTO>> {
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
                .json({ chatId: methodData.chatId })
                .status(StatusClient.HTTP_STATUS_OK.status);
        } catch (e) {
            return res
                .json({ message: errMessages.createNewChat })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Get('chatId/:chatId')
    @ApiOperation({
        summary: 'Пойск чата по id',
        description: FindByIdDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Чат найден',
        type: GetChatByIdResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован',
    })
    @ApiResponse({
        status: 404,
        description: 'Чат не найден',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для поиска чата по id',
        type: GetChatByIdRequestDTO,
    })
    async getChatById(
        @Param('chatId') chatId: GetChatByIdRequestDTO,
        @Res() res: Response,
    ): Promise<Response<GetChatByIdResponseDTO>> {
        try {
            const methodData = await this.chatService.GetChatById(chatId);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .json(methodData.chatData)
                .status(StatusClient.HTTP_STATUS_OK.status);
        } catch (e) {
            console.error(e);
            return res
                .json({ message: errMessages.getChatById })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Get('chatName/:chatName')
    @ApiOperation({
        summary: 'Пойск чата по username',
        description: getChatByChatNameDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Чат найден',
        type: [GetChatByChatNameResponseDTO],
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован',
    })
    @ApiResponse({
        status: 404,
        description: 'Нет такого чата',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для поиска по username',
        type: GetChatByChatNameRequestDTO,
    })
    async getChatByChatName(
        @Param('chatName') chatName: GetChatByChatNameRequestDTO,
        @Res() res: Response,
    ): Promise<Response<GetChatByChatNameResponseDTO[]>> {
        try {
            const methodData =
                await this.chatService.GetChatByChatName(chatName);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res
                .json(methodData.chatData)
                .status(StatusClient.HTTP_STATUS_OK.status);
        } catch (e) {
            return res
                .json({ message: errMessages.getChatByChatName })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post('update/:chatId')
    @ApiOperation({
        summary: 'Изменить информацию о чате',
        description: updateChatByIdDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Чат обновлен',
        type: UpdateChatByIdResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован',
    })
    @ApiResponse({
        status: 403,
        description: 'Недостаточно прав',
    })
    @ApiResponse({
        status: 404,
        description: 'Нет такого чата',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для изменения информации о чате',
        type: UpdateChatByIdRequestDTO,
    })
    async updateChatById(
        @Body() payload: UpdateChatByIdRequestDTO,
        @Res() res: Response,
    ): Promise<Response<UpdateChatByIdResponseDTO>> {
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

    @Delete('delete/:chatId')
    @ApiOperation({
        summary: 'Удаление чата',
        description: deleteChatByIdDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Чат удалён',
        type: DeleteChatByIdResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован',
    })
    @ApiResponse({
        status: 403,
        description: 'Недостаточно прав',
    })
    @ApiResponse({
        status: 404,
        description: 'Нет такого чата',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для удаления чата',
        type: DeleteChatByIdRequestDTO,
    })
    async deleteChatById(
        @Param('chatId') payload: DeleteChatByIdRequestDTO,
        @Req() req: Request,
        @Res() res: Response,
    ): Promise<Response<DeleteChatByIdResponseDTO>> {
        try {
            const { userId } = req.cookies;
            const validateUserId = +userId;
            const data: DeleteChatByIdRequest = {
                chatId: payload.toString(),
                userId: validateUserId,
            };
            const methodData = await this.chatService.DeleteChatById(data);
            if (!methodData) {
                return res
                    .json({
                        message: StatusClient.HTTP_STATUS_NOT_FOUND.message,
                    })
                    .status(StatusClient.HTTP_STATUS_NOT_FOUND.status);
            }
            return res.json(methodData.message).status(200);
        } catch (e) {
            return res
                .json({ message: errMessages.deleteChatById })
                .status(StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status);
        }
    }

    @Post(':chatId/add/:userId')
    @ApiOperation({
        summary: 'Добавление пользователя в чат',
        description: addUserToChatDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Пользователь добавлен',
        type: AddUserToChatResponsetDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован',
    })
    @ApiResponse({
        status: 404,
        description: 'Пользователь не найден',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для добавления пользователя в чат',
        type: AddUserToChatRequestDTO,
    })
    async addUserToChat(
        @Body() payload: AddUserToChatRequestDTO,
        @Res() res: Response,
    ): Promise<Response<AddUserToChatResponsetDTO>> {
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
    @ApiOperation({
        summary: 'Удаление из чата пользователя',
        description: removeUserFromChatDocs,
    })
    @ApiCookieAuth('userId')
    @ApiCookieAuth('jwtToken')
    @ApiResponse({
        status: 200,
        description: 'Пользователь удалён из чата',
        type: RemoveUserFromChatResponseDTO,
    })
    @ApiResponse({
        status: 400,
        description: 'Неправильный запрос',
    })
    @ApiResponse({
        status: 401,
        description: 'Не авторизован',
    })
    @ApiResponse({
        status: 404,
        description: 'Пользователь не найден',
    })
    @ApiResponse({
        status: 500,
        description: 'Ошибка сервера',
    })
    @ApiBody({
        description: 'Данные для удаления пользователя из чата',
        type: RemoveUserFromChatRequestDTO,
    })
    async RemoveUserFromChat(
        @Body() payload: RemoveUserFromChatRequestDTO,
        @Res() res: Response,
    ): Promise<Response<RemoveUserFromChatResponseDTO>> {
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
