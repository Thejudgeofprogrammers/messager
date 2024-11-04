import {
    BadRequestException,
    Controller,
    Inject,
    InternalServerErrorException,
    Logger,
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
} from '../../protos/proto_gen_files/auth';

import {
    UserService,
    FindUserByIdResponse,
} from '../../protos/proto_gen_files/user';

import { SessionUserService as SessionUserInterfase } from '../../protos/proto_gen_files/session_user';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';

@Controller('AuthService')
export class AuthService implements AuthInterface {
    private readonly logger = new Logger(AuthService.name);
    private userMicroService: UserService;
    private sessionUser: SessionUserInterfase;

    constructor(
        @Inject('USER_PACKAGE') private readonly userClient: ClientGrpc,
        private readonly cryptService: CryptService,

        private readonly tokenService: TokenService,

        @Inject('SESSION_PACKAGE')
        private readonly sessionUserClient: ClientGrpc,

        @InjectMetric('PROM_METRIC_AUTH_LOGIN_TOTAL')
        private readonly loginTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_AUTH_LOGIN_FAILURE_TOTAL')
        private readonly loginFailureTotal: Counter<string>,

        @InjectMetric('PROM_METRIC_AUTH_LOGIN_DURATION')
        private readonly loginDuration: Histogram<string>,

        @InjectMetric('PROM_METRIC_AUTH_REGISTER_DURATION')
        private readonly registerDuration: Histogram<string>,

        @InjectMetric('PROM_METRIC_AUTH_REGISTER_TOTAL')
        private readonly registerTotal: Counter<string>,
    ) {}

    async onModuleInit() {
        try {
            this.userMicroService =
                this.userClient.getService<UserService>('UserService');
            this.logger.log('User microservice initialized successfully.');
        } catch (error) {
            this.logger.error('Error initializing user microservice: ', error);
            throw new InternalServerErrorException(
                'User service is unavailable',
            );
        }
    }

    @GrpcMethod('AuthService', 'Register')
    async Register(data: RegisterRequest): Promise<RegisterResponse> {
        const end = this.registerDuration.startTimer();
        try {
            if (!data.email && !data.phoneNumber && !data.password)
                throw new BadRequestException('Data missing');

            if (
                !this.userMicroService ||
                !this.userMicroService.FindUserByEmail
            ) {
                this.logger.error('userMicroService is not initialized');
                throw new InternalServerErrorException(
                    'User service is unavailable',
                );
            }

            const hashedPassword = await this.cryptService.hashPassword(
                data.password,
            );

            const responseUser = await lastValueFrom(
                from(
                    this.userMicroService.CreateNewUser({
                        username: data.username,
                        email: data.email,
                        passwordHash: hashedPassword,
                        phoneNumber: data.phoneNumber,
                    }),
                ),
            );

            this.registerTotal.inc();
            return {
                message: responseUser.message,
                status: responseUser.status,
            };
        } catch (e) {
            this.logger.error('Error during registration', e);
            throw new InternalServerErrorException(`Server have problem ${e}`);
        } finally {
            end();
        }
    }

    @GrpcMethod('AuthService', 'Login')
    async Login(data: LoginRequest): Promise<LoginResponse> {
        const end = this.loginDuration.startTimer();
        try {
            const { phoneNumber, email, password } = data;
            let existUser: FindUserByIdResponse;
            if (!email || !phoneNumber) {
                throw new BadRequestException('Email and PhoneNumber missing');
            }
            if (!phoneNumber) {
                existUser = await lastValueFrom(
                    from(
                        this.userMicroService.FindUserByEmail({
                            email: data.email,
                        }),
                    ),
                );
            } else {
                existUser = await lastValueFrom(
                    from(
                        this.userMicroService.FindUserByPhoneNumber({
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
                this.loginTotal.inc();
                return userSessia;
            } else {
                this.loginFailureTotal.inc();
                throw new UnauthorizedException('User unauthorized');
            }
        } catch (e) {
            throw new InternalServerErrorException(`Server have problem ${e}`);
        } finally {
            end();
        }
    }

    @GrpcMethod('AuthService', 'Logout')
    async Logout(data: LogoutRequest): Promise<LogoutResponse> {
        const end = this.loginDuration.startTimer();
        try {
            if (!data.userId) {
                throw new BadRequestException('user_id is missing');
            }
            await lastValueFrom(
                from(
                    this.sessionUser.DeleteUserSession({ userId: data.userId }),
                ),
            );
            this.loginTotal.inc();
            return { message: 'User logout successfilly', status: 200 };
        } catch (e) {
            this.logger.error('Error during logout', e);
            throw new InternalServerErrorException('Server have problem');
        } finally {
            end();
        }
    }
}
