import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, User } from '@prisma/client';
import { CreateNewUserRequest } from '../../protos/proto_gen_files/user';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(private readonly configService: ConfigService) {
        super();
    }

    async createUser(data: CreateNewUserRequest): Promise<User> {
        try {
            return await this.user.create({
                data: {
                    username: data.username,
                    email: data.email,
                    phone_number: data.phoneNumber,
                    password_hash: data.passwordHash,
                },
            });
        } catch (error) {
            console.error('Error creating user:', error);
            throw new InternalServerErrorException('Unable to create user');
        }
    }

    async findUserById(user_id: number): Promise<User> {
        try {
            return await this.user.findUnique({ where: { user_id } });
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw new InternalServerErrorException('Unable to find user by ID');
        }
    }

    async findUserByEmail(email: string): Promise<User> {
        try {
            return await this.user.findUnique({ where: { email } });
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new InternalServerErrorException(
                'Unable to find user by email',
            );
        }
    }

    async findUserByPhone(phone_number: string): Promise<User> {
        try {
            return await this.user.findUnique({
                where: { phone_number },
            });
        } catch (error) {
            console.error('Error finding user by phone number:', error);
            throw new InternalServerErrorException(
                'Unable to find user by phone number',
            );
        }
    }

    async findUserByUsername(username: string): Promise<User[]> {
        try {
            return await this.user.findMany({
                where: { username },
                take: this.configService.get<number>('more_users_find'),
            });
        } catch (error) {
            console.error('Error finding users by username:', error);
            throw new InternalServerErrorException(
                'Unable to find users by username',
            );
        }
    }
}
