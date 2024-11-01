import {
    BadRequestException,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {
    AuthService as AuthInterface,
    LoginRequest,
    LoginResponse,
    LogoutRequest,
    LogoutResponse,
    RegisterRequest,
    RegisterResponse,
} from '../../../../protos/proto_gen_files/auth';
import { ClientGrpc } from '@nestjs/microservices';
import { from, lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
    private authMicroService: AuthInterface;

    constructor(
        @Inject('AUTH_PACKAGE') private readonly authClient: ClientGrpc,
    ) {}

    onModuleInit() {
        this.authMicroService =
            this.authClient.getService<AuthInterface>('AuthService');
    }

    async registerUser(payload: RegisterRequest): Promise<RegisterResponse> {
        if (
            !payload.email ||
            !payload.password ||
            !payload.phoneNumber ||
            !payload.username
        ) {
            throw new BadRequestException('User did not enter a data');
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
                this.authMicroService.Register({
                    email: payload.email,
                    phoneNumber: payload.phoneNumber,
                    username: payload.username,
                    password: payload.password,
                }),
            ),
        );

        return { message: userData.message, status: userData.status };
    }

    async loginUser(payload: LoginRequest): Promise<LoginResponse> {
        if (
            (!payload.email && !payload.phoneNumber) ||
            !payload.password ||
            (payload.email && payload.phoneNumber)
        ) {
            throw new BadRequestException(
                'User must enter either email or phone number, along with a password.',
            );
        }

        let data: LoginRequest;
        let validatePayload: string;

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
        } else if (validatePayload === 'email') {
            data = {
                email: payload.email,
                password: payload.password,
            };
        } else if (validatePayload === 'unknown') {
            throw new BadRequestException('Without email or phone number');
        }

        const userData = await lastValueFrom(
            from(this.authMicroService.Login(data)),
        );

        if (!userData.userId) {
            throw new UnauthorizedException('Password or login missing');
        } else {
            return userData;
        }
    }

    async logoutUser(userId: LogoutRequest): Promise<LogoutResponse> {
        if (!userId) {
            throw new BadRequestException('UserId is missing');
        }

        const userData = await lastValueFrom(
            from(this.authMicroService.Logout(userId)),
        );

        return { message: userData.message, status: userData.status };
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
