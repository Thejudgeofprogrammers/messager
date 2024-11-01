import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, User } from '@prisma/client';
import { CreateNewUserRequest } from '../../../../protos/proto_gen_files/user';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly configService: ConfigService) {
        super();
    }

    async createUser(data: CreateNewUserRequest): Promise<User> {
        return this.user.create({
            data: {
                username: data.username,
                email: data.email,
                phone_number: data.phoneNumber,
                password_hash: data.passwordHash,
            },
        });
    }

    async findUserById(user_id: number): Promise<User> {
        const existUser = await this.user.findUnique({ where: { user_id } });
        if (existUser == null) {
            throw new NotFoundException('User Not Found');
        }
        return existUser;
    }

    async findUserByEmail(email: string): Promise<User> {
        const existUser = await this.user.findUnique({ where: { email } });
        if (existUser == null) {
            throw new NotFoundException('User Not Found');
        }
        return existUser;
    }

    async findUserByTag(tag: string): Promise<User> {
        const existUser = await this.user.findUnique({ where: { tag } });
        if (existUser == null) {
            throw new NotFoundException('User Not Found');
        }
        return existUser;
    }

    async findUserByPhone(phone_number: string): Promise<User> {
        const existUser = await this.user.findUnique({
            where: { phone_number },
        });
        if (existUser == null) {
            throw new NotFoundException('User Not Found');
        }
        return existUser;
    }

    async findUserByUsername(username: string): Promise<User[]> {
        const existMore = await this.user.findMany({
            where: { username },
            take: this.configService.get<number>('more_users_find'),
        });
        if (existMore.length == 0) {
            throw new NotFoundException('User Not Found');
        }
        return existMore;
    }
}
