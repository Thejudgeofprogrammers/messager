import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
    // UserService as UserInterfase,
    FindUserByIdRequest,
    FindUserByIdResponse,
    FindUserByEmailRequest,
    FindUserByEmailResponse,
    FindUserByPhoneNumberRequest,
    FindUserByPhoneNumberResponse,
    // DeleteAvatarUserResponse,
    // DeleteAvatarUserRequest,
    // AddAvatarToUserResponse,
    // AddAvatarToUserRequest,
    // UpdateUserPasswordResponse,
    // UpdateUserPasswordRequest,
    // UpdateUserProfileRequest,
    // FindUserProfileRequest,
    // FindUserAvatarsRequest,
    // FindUserProfileResponse,
    // FindUserAvatarsResponse,
    FindUserByUsernameRequest,
    FindUserByTagRequest,
    FindUserByUsernameResponse,
    FindUserByTagResponse,
    CreateNewUserRequest,
    CreateNewUserResponse,
} from '../../../../protos/proto_gen_files/user';

// implements UserInterfase

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    @GrpcMethod('UserService', 'CreateNewUser')
    async CreateNewUser(
        request: CreateNewUserRequest,
    ): Promise<CreateNewUserResponse> {
        try {
            const existUser = await this.prismaService.findUserByEmail(
                request.email,
            );
            if (existUser) {
                throw new BadRequestException('User exist');
            }
            await this.prismaService.createUser(request);
            const data = { message: 'User created', status: 201 };
            return data;
        } catch (e) {
            throw new InternalServerErrorException('Server have problem');
        }
    }

    @GrpcMethod('UserService', 'FindUser')
    async FindUserById(
        request: FindUserByIdRequest,
    ): Promise<FindUserByIdResponse> {
        const { userId } = request;
        const existUser = await this.prismaService.findUserById(userId);
        return {
            userId: existUser.user_id,
            phoneNumber: existUser.phone_number,
            email: existUser.email,
            tag: existUser.tag,
            passwordHash: existUser.password_hash,
            username: existUser.username,
        };
    }

    @GrpcMethod('UserService', 'FindUserByUsername')
    async FindUserByUsername(
        request: FindUserByUsernameRequest,
    ): Promise<FindUserByUsernameResponse> {
        const { username } = request;

        const existUsers =
            await this.prismaService.findUserByUsername(username);

        return {
            users: existUsers.map((user) => ({
                userId: user.user_id,
                username: user.username,
            })),
        };
    }

    @GrpcMethod('UserService', 'FindUserByTag')
    async FindUserByTag(
        request: FindUserByTagRequest,
    ): Promise<FindUserByTagResponse> {
        const { tag } = request;
        const existUser = await this.prismaService.findUserByTag(tag);
        return {
            userId: existUser.user_id,
            phoneNumber: existUser.phone_number,
            email: existUser.email,
            tag: existUser.tag,
            passwordHash: existUser.password_hash,
            username: existUser.username,
        };
    }

    @GrpcMethod('UserService', 'FindUserByEmail')
    async FindUserByEmail(
        request: FindUserByEmailRequest,
    ): Promise<FindUserByEmailResponse> {
        const { email } = request;
        const existUser = await this.prismaService.findUserByEmail(email);
        return {
            userId: existUser.user_id,
            phoneNumber: existUser.phone_number,
            email: existUser.email,
            tag: existUser.tag,
            passwordHash: existUser.password_hash,
            username: existUser.username,
        };
    }

    @GrpcMethod('UserService', 'FindUserByPhone')
    async FindUserByPhoneNumber(
        request: FindUserByPhoneNumberRequest,
    ): Promise<FindUserByPhoneNumberResponse> {
        const { phoneNumber } = request;
        const existUser = await this.prismaService.findUserByPhone(phoneNumber);
        return {
            userId: existUser.user_id,
            phoneNumber: existUser.phone_number,
            email: existUser.email,
            tag: existUser.tag,
            passwordHash: existUser.password_hash,
            username: existUser.username,
        };
    }

    // @GrpcMethod('UserService', 'FindUserProfile')
    // async FindUserProfile(
    //     request: FindUserProfileRequest,
    // ): Promise<FindUserProfileResponse> {}

    // @GrpcMethod('UserService', 'UpdateUserProfile')
    // async UpdateUserProfile(
    //     request: UpdateUserProfileRequest,
    // ): Promise<UpdateUserProfileResponse> {}
    // @GrpcMethod('UserService', 'UpdateUserPassword')
    // async UpdateUserPassword(
    //     request: UpdateUserPasswordRequest,
    // ): Promise<UpdateUserPasswordResponse> {}

    // @GrpcMethod('UserService', 'FindUserAvatars')
    // async FindUserAvatars(
    //     request: FindUserAvatarsRequest,
    // ): Promise<FindUserAvatarsResponse> {}

    // @GrpcMethod('UserService', 'AddAvatarToUser')
    // async AddAvatarToUser(
    //     request: AddAvatarToUserRequest,
    // ): Promise<AddAvatarToUserResponse> {}
    // @GrpcMethod('UserService', 'DeleteAvatarUser')
    // async DeleteAvatarUser(
    //     request: DeleteAvatarUserRequest,
    // ): Promise<DeleteAvatarUserResponse> {}
}
