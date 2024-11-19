import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    OnModuleInit,
    UnauthorizedException,
} from '@nestjs/common';
import {
    AuthService,
    LoginResponse,
    RegisterRequest,
} from 'src/protos/proto_gen_files/auth';
import { Client, ClientGrpc, RpcException } from '@nestjs/microservices';
import { from, lastValueFrom } from 'rxjs';
import {
    grpcClientOptionsUser,
    grpcClientOptionsAuth,
} from 'src/config/grpc/grpc.options';
import {
    CreateNewUserResponse,
    FindUserByPhoneNumberResponse,
    RemoveAccountResponse,
    UserService as UserInterface,
} from 'src/protos/proto_gen_files/user';
import { grpcClientOptionsSessionUser } from 'src/config/grpc/grpc.options';
import { SessionUserService } from 'src/protos/proto_gen_files/session_user';
import { LoginFormDTO, RemoveAccountRequestDTO } from './dto';
import { StatusClient } from 'src/common/status';
import { errMessages } from 'src/common/messages';
import { UserService as UserServiceGateway } from '../user/user.service';

@Injectable()
export class AuthorizeService implements OnModuleInit {
    @Client(grpcClientOptionsAuth)
    private readonly authClient: ClientGrpc;
    @Client(grpcClientOptionsUser)
    private readonly userClient: ClientGrpc;
    @Client(grpcClientOptionsSessionUser)
    private readonly sessionUserClient: ClientGrpc;

    private authMicroservice: AuthService;
    private userMicroservice: UserInterface;
    private sessionUserMicroservice: SessionUserService;

    constructor(private readonly userServiceGateway: UserServiceGateway) {}

    onModuleInit() {
        this.authMicroservice =
            this.authClient.getService<AuthService>('AuthService');

        this.userMicroservice =
            this.userClient.getService<UserInterface>('UserService');

        this.sessionUserMicroservice =
            this.sessionUserClient.getService<SessionUserService>(
                'SessionUserService',
            );
    }

    async DeleteUser(
        payload: RemoveAccountRequestDTO,
    ): Promise<RemoveAccountResponse> {
        try {
            if (!payload.userId || !payload.password) {
                throw new BadRequestException('Недостаточно данных');
            }

            const userId: number = +payload.userId;

            const dataUser = await this.userServiceGateway.GetPasswordUser({
                userId,
            });

            const existPassword = await lastValueFrom(
                from(
                    this.authMicroservice.CheckPassword({
                        password: payload.password,
                        hashedPassword: dataUser.hashedPassword,
                    }),
                ),
            );

            if (existPassword.exist == true) {
                throw new UnauthorizedException('Password not verify');
            }

            const delUser = await this.userServiceGateway.RemoveAccount({
                userId,
            });

            return { message: delUser.message };
        } catch (e) {
            throw new InternalServerErrorException('Ошибка');
        }
    }

    async registerUser(
        payload: RegisterRequest,
    ): Promise<CreateNewUserResponse> {
        if (
            !payload.email ||
            !payload.password ||
            !payload.phoneNumber ||
            !payload.username
        ) {
            throw new BadRequestException(
                StatusClient.HTTP_STATUS_BAD_REQUEST.message,
            );
        }
        if (
            payload.email !== payload.email.trim() ||
            payload.password !== payload.password.trim() ||
            payload.phoneNumber !== payload.phoneNumber.trim() ||
            payload.username !== payload.username.trim()
        ) {
            throw new BadRequestException('Whitespace in form registry');
        }
        const validateEmail = this.classifyInput(payload.email);
        if (validateEmail !== 'email') {
            throw new BadRequestException('Validation failed');
        }
        const validatePhone = this.classifyInput(payload.phoneNumber);
        if (validatePhone !== 'phone') {
            throw new BadRequestException('Validation failed');
        }

        const userData = await lastValueFrom(
            from(
                this.authMicroservice.Register({
                    email: payload.email,
                    phoneNumber: payload.phoneNumber,
                    username: payload.username,
                    password: payload.password,
                }),
            ),
        );

        const userDataCreate: CreateNewUserResponse = await lastValueFrom(
            from(
                this.userMicroservice.CreateNewUser({
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    username: userData.username,
                    passwordHash: userData.passwordHash,
                }),
            ),
        );

        return {
            info: {
                message: userDataCreate.info.message,
                status: userDataCreate.info.status,
            },
        };
    }

    async loginUser(payload: LoginFormDTO): Promise<LoginResponse> {
        if (
            (!payload.email && !payload.phoneNumber) ||
            !payload.password ||
            (payload.email && payload.phoneNumber)
        ) {
            throw new BadRequestException(
                StatusClient.HTTP_STATUS_BAD_REQUEST.message,
            );
        }

        let data: LoginFormDTO;
        let validatePayload: string;
        let existUser: FindUserByPhoneNumberResponse;

        if (payload.email) {
            validatePayload = this.classifyInput(payload.email);
        }
        if (payload.phoneNumber) {
            validatePayload = this.classifyInput(payload.phoneNumber);
        }

        if (validatePayload === 'phone') {
            data = {
                phoneNumber: payload.phoneNumber.trim(),
                password: payload.password,
            };

            existUser = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserByPhoneNumber({
                        phoneNumber: data.phoneNumber.toString(),
                    }),
                ),
            );
        } else if (validatePayload === 'email') {
            data = {
                email: payload.email.trim(),
                password: payload.password,
            };

            existUser = await lastValueFrom(
                from(
                    this.userMicroservice.FindUserByEmail({
                        email: data.email,
                    }),
                ),
            );
        } else if (validatePayload === 'unknown') {
            throw new BadRequestException('Without email or phone number');
        }
        const userPlusPassword = {
            userId: existUser.userData.userId,
            email: existUser.userData.email,
            passwordHash: existUser.userData.passwordHash,
            password: payload.password,
        };

        const userData = await lastValueFrom(
            from(this.authMicroservice.Login(userPlusPassword)),
        );

        if (!userData.userId) {
            throw new UnauthorizedException('Password or login missing');
        } else {
            await lastValueFrom(
                from(this.sessionUserMicroservice.SaveUserSession(userData)),
            );

            return userData;
        }
    }

    async logoutUser(
        userId: number,
        jwtToken: string,
    ): Promise<{
        message: string;
        status: number;
    }> {
        try {
            if (!userId) {
                throw new BadRequestException('UserId is missing');
            }

            const userData = await lastValueFrom(
                from(
                    this.sessionUserMicroservice.DeleteUserSession({
                        userId,
                        jwtToken,
                    }),
                ),
            );

            return { message: userData.message, status: userData.status };
        } catch (e) {
            if (e.code === 'UNAVAILABLE' || e.message.includes('connect')) {
                throw new RpcException({
                    message: StatusClient.RPC_EXCEPTION.message,
                    code: e.code,
                });
            }

            throw new RpcException({
                message: errMessages.logout,
                code: StatusClient.HTTP_STATUS_INTERNAL_SERVER_ERROR.status,
            });
        }
    }

    classifyInput(input: string): string {
        const phonePattern =
            /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (phonePattern.test(input)) {
            return 'phone';
        }

        if (emailPattern.test(input)) {
            return 'email';
        }

        return 'unknown';
    }
}
