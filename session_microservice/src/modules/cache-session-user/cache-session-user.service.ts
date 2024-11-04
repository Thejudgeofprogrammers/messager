import {
    BadRequestException,
    Controller,
    InternalServerErrorException,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
    SessionUserService as UserSessionInterface,
    SaveUserSessionRequest,
    SaveUserSessionResponse,
    GetUserSessionRequest,
    GetUserSessionResponse,
    DeleteUserSessionRequest,
    DeleteUserSessionResponse,
} from '../../../protos/proto_gen_files/session_user';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Controller('SessionUserService')
export class SessionUserService implements UserSessionInterface {
    private redis: Redis;

    constructor(private readonly configService: ConfigService) {
        this.redis = new Redis({
            host: this.configService.get<string>('redis.host'),
            port: this.configService.get<number>('redis.port'),
        });
    }

    @GrpcMethod('SessionUserService', 'SaveUserSession')
    async SaveUserSession(
        data: SaveUserSessionRequest,
    ): Promise<SaveUserSessionResponse> {
        try {
            if (!data.userId) throw new BadRequestException('userId missing');
            await this.redis.set(data.userId.toString(), data.jwtToken);
            return { message: 'User session saved successfully' };
        } catch (error) {
            throw new InternalServerErrorException('Server have problem');
        }
    }

    @GrpcMethod('SessionUserService', 'GetUserSession')
    async GetUserSession(
        data: GetUserSessionRequest,
    ): Promise<GetUserSessionResponse> {
        try {
            if (!data.userId) throw new BadRequestException('userId missing');
            const token = await this.redis.get(data.userId.toString());
            if (!token) throw new BadRequestException('Token missing');
            return { userId: data.userId, jwtToken: token || '' };
        } catch (e) {
            throw new InternalServerErrorException('Server have problem');
        }
    }

    @GrpcMethod('SessionUserService', 'DeleteUserSession')
    async DeleteUserSession(
        data: DeleteUserSessionRequest,
    ): Promise<DeleteUserSessionResponse> {
        await this.redis.del(data.userId.toString());
        return { message: 'User session deleted successfully' };
    }
}
