import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
    UserService as UserInterface,
    FindUserByIdRequest,
    FindUserByIdResponse,
    FindUserByEmailRequest,
    FindUserByEmailResponse,
    FindUserByPhoneNumberRequest,
    FindUserByPhoneNumberResponse,
    FindUserByUsernameRequest,
    FindUserByTagRequest,
    FindUserByUsernameResponse,
    FindUserByTagResponse,
} from '../../../protos/proto_gen_files/user';

import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
    private userMicroService: UserInterface;

    constructor(
        @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.userMicroService =
            this.userClient.getService<UserInterface>('UserService');
    }

    validateUser(payload) {
        const validateUser = {
            userId: payload.userId,
            email: payload.email,
            username: payload.username,
            phoneNumber: payload.phoneNumber,
            tag: payload.tag,
        };
        return validateUser;
    }

    async findUserById(
        payload: FindUserByIdRequest,
    ): Promise<Omit<FindUserByIdResponse, 'passwordHash'>> {
        try {
            if (!payload || !payload.userId) {
                throw new BadRequestException('User ID is required');
            }

            const userData = await lastValueFrom(
                from(
                    this.userMicroService.FindUserById({
                        userId: payload.userId,
                    }),
                ),
            );

            if (!userData) {
                throw new InternalServerErrorException('User not found');
            }

            const userWithoutPassword = this.validateUser(userData);

            return userWithoutPassword;
        } catch (e) {
            console.error('Error in UserService.findUserById:', e);
            throw new InternalServerErrorException(
                `Server have problem: ${e.message}`,
            );
        }
    }

    async findUserByTag(
        payload: FindUserByTagRequest,
    ): Promise<Omit<FindUserByTagResponse, 'passwordHash'>> {
        try {
            const userData = await lastValueFrom(
                from(this.userMicroService.FindUserByTag({ tag: payload.tag })),
            );
            const userWithoutPassword = this.validateUser(userData);

            return userWithoutPassword;
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem: ${e}`);
        }
    }

    async findUserByPhone(
        payload: FindUserByPhoneNumberRequest,
    ): Promise<Omit<FindUserByPhoneNumberResponse, 'passwordHash'>> {
        try {
            if (!payload) {
                throw new BadRequestException('Data missing');
            }
            const userData = await lastValueFrom(
                from(
                    this.userMicroService.FindUserByPhoneNumber({
                        phoneNumber: payload.phoneNumber,
                    }),
                ),
            );
            const userWithoutPassword = this.validateUser(userData);

            return userWithoutPassword;
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem: ${e}`);
        }
    }

    async findUserByEmail(
        payload: FindUserByEmailRequest,
    ): Promise<Omit<FindUserByEmailResponse, 'passwordHash'>> {
        try {
            if (!payload) {
                throw new BadRequestException('Data missing');
            }
            const userData = await lastValueFrom(
                from(
                    this.userMicroService.FindUserByEmail({
                        email: payload.email,
                    }),
                ),
            );
            const userWithoutPassword = this.validateUser(userData);

            return userWithoutPassword;
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem: ${e}`);
        }
    }

    async findUserByUsername(
        payload: FindUserByUsernameRequest,
    ): Promise<FindUserByUsernameResponse> {
        try {
            if (!payload) {
                throw new BadRequestException('Data missing');
            }
            const userData = await lastValueFrom(
                from(
                    this.userMicroService.FindUserByUsername({
                        username: payload.username,
                    }),
                ),
            );

            return userData;
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem: ${e}`);
        }
    }
}
