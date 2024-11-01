import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';

import { CryptService } from '../crypt/crypt.service';
import { TokenService } from '../token/token.service';
import { from, lastValueFrom } from 'rxjs';

import { ClientGrpc, GrpcMethod } from '@nestjs/microservices';
import {
    AuthService as AuthInterface,
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
} from '../../../../protos/proto_gen_files/auth';

import {
    UserService as UserInterfase,
    FindUserByEmailResponse,
    FindUserByIdResponse,
    FindUserByPhoneNumberResponse,
} from '../../../../protos/proto_gen_files/user';

import { SessionUserService as SessionUserInterfase } from '../../../../protos/proto_gen_files/session_user';

@Injectable()
export class AuthService implements AuthInterface {
    private userService: UserInterfase;
    private sessionUser: SessionUserInterfase;

    constructor(
        private readonly cryptService: CryptService,
        private readonly tokenService: TokenService,
        @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
        @Inject('SESSION_PACKAGE')
        private readonly sessionUserClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.userService =
            this.userClient.getService<UserInterfase>('UserService');
        this.sessionUser =
            this.sessionUserClient.getService<SessionUserInterfase>(
                'SessionUserService',
            );
    }

    @GrpcMethod('AuthService', 'Register')
    async Register(data: RegisterRequest): Promise<RegisterResponse> {
        try {
            if (!data.email && !data.phoneNumber && !data.password)
                throw new BadRequestException('Data missing');

            const existByEmail: FindUserByEmailResponse = await lastValueFrom(
                from(this.userService.FindUserByEmail({ email: data.email })),
            );

            if (existByEmail) throw new BadRequestException('User exist');

            const existByPhone: FindUserByPhoneNumberResponse =
                await lastValueFrom(
                    from(
                        this.userService.FindUserByPhoneNumber({
                            phoneNumber: data.phoneNumber,
                        }),
                    ),
                );

            if (existByPhone) throw new BadRequestException('User exist');

            const hashedPassword = await this.cryptService.hashPassword(
                data.password,
            );

            const responseUser = await lastValueFrom(
                from(
                    this.userService.CreateNewUser({
                        username: data.username,
                        email: data.email,
                        passwordHash: hashedPassword,
                        phoneNumber: data.phoneNumber,
                    }),
                ),
            );

            return {
                message: responseUser.message,
                status: responseUser.status,
            };
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem ${e}`);
        }
    }

    @GrpcMethod('AuthService', 'Login')
    async Login(data: LoginRequest): Promise<LoginResponse> {
        try {
            const { phoneNumber, email, password } = data;
            let existUser: FindUserByIdResponse;
            if (!email || !phoneNumber) {
                throw new BadRequestException('Email and PhoneNumber missing');
            }
            if (!phoneNumber) {
                existUser = await lastValueFrom(
                    from(
                        this.userService.FindUserByEmail({ email: data.email }),
                    ),
                );
            } else {
                existUser = await lastValueFrom(
                    from(
                        this.userService.FindUserByPhoneNumber({
                            phoneNumber: data.phoneNumber,
                        }),
                    ),
                );
            }

            const checkUser = await this.cryptService.comparePassword(
                password,
                existUser.passwordHash,
            );
            if (checkUser) {
                const payload = {
                    userId: existUser.userId,
                    email: existUser.email,
                };

                const jwtToken = await this.tokenService.generateToken(payload);

                const userSessia = {
                    userId: existUser.userId,
                    jwtToken: jwtToken,
                };

                await lastValueFrom(
                    from(this.sessionUser.SaveUserSession(userSessia)),
                );

                return userSessia;
            } else {
                throw new UnauthorizedException('User unauthorized');
            }
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem ${e}`);
        }
    }

    @GrpcMethod('AuthService', 'Logout')
    async Logout(data: LogoutRequest): Promise<LogoutResponse> {
        try {
            if (!data.userId) {
                throw new BadRequestException('user_id is missing');
            }
            await lastValueFrom(
                from(
                    this.sessionUser.DeleteUserSession({ userId: data.userId }),
                ),
            );
            return { message: 'User logout successfilly', status: 200 };
        } catch (e) {
            throw new InternalServerErrorException('Server have problem');
        }
    }
}
