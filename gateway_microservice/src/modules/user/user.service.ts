import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    OnModuleInit,
} from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { from, lastValueFrom } from 'rxjs';
import {
    UserService as UserServiceClient,
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
    UserData,
} from 'src/protos/proto_gen_files/user';
import { grpcClientOptionsUser } from 'src/config/grpc/grpc.options';

@Injectable()
export class UserService implements OnModuleInit {
    @Client(grpcClientOptionsUser)
    private readonly userClient: ClientGrpc;

    private userMicroservice: UserServiceClient;

    onModuleInit() {
        this.userMicroservice =
            this.userClient.getService<UserServiceClient>('UserService');
    }

    validateUser(payload: UserData): any {
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
            const userInfo = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserById({
                        userId: payload.userId,
                    }),
                ),
            );

            if (!userInfo.userData) {
                throw new NotFoundException('User not found');
            }

            const userWithoutPassword = this.validateUser(userInfo.userData);

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
            const userInfo = await lastValueFrom(
                from(this.userMicroservice.FindUserByTag({ tag: payload.tag })),
            );

            if (!userInfo.userData) {
                throw new NotFoundException('User not found');
            }

            const userWithoutPassword = this.validateUser(userInfo.userData);

            return { userData: userWithoutPassword };
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem: ${e}`);
        }
    }

    async findUserByPhone(
        payload: FindUserByPhoneNumberRequest,
    ): Promise<Omit<FindUserByPhoneNumberResponse, 'userData.passwordHash'>> {
        try {
            const userInfo = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserByPhoneNumber({
                        phoneNumber: payload.phoneNumber,
                    }),
                ),
            );

            if (!userInfo) {
                throw new NotFoundException('User not found');
            }

            const userWithoutPassword = this.validateUser(userInfo.userData);

            return { userData: userWithoutPassword };
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem: ${e}`);
        }
    }

    async findUserByEmail(
        payload: FindUserByEmailRequest,
    ): Promise<Omit<FindUserByEmailResponse, 'passwordHash'>> {
        try {
            const userInfo = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserByEmail({
                        email: payload.email,
                    }),
                ),
            );

            if (!userInfo) {
                throw new NotFoundException('User not found');
            }

            const userWithoutPassword = this.validateUser(userInfo.userData);

            return userWithoutPassword;
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem: ${e}`);
        }
    }

    async findUserByUsername(
        payload: FindUserByUsernameRequest,
    ): Promise<FindUserByUsernameResponse> {
        try {
            const userInfo = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserByUsername({
                        username: payload.username,
                    }),
                ),
            );

            if (!userInfo) {
                throw new NotFoundException('User not found');
            }

            return userInfo;
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem: ${e}`);
        }
    }
}
