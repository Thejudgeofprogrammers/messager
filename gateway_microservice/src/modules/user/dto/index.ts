import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';

export class FindUserByIdRequestDTO {
    @ApiProperty({
        example: 12,
        description: 'id пользователя',
    })
    @IsNumber()
    userId: number;
}

export class FindUserByIdResponseDTO {
    @ApiProperty({
        example: 12,
        description: 'id пользователя',
    })
    @IsNumber()
    userId: number;

    @ApiProperty({
        example: '+123456789',
        description: 'Номер телефона пользователя',
    })
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        example: 'example@mail.ru',
        description: 'Почта пользователя',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '123456gew',
        description: 'Пароль пользователя',
    })
    @IsString()
    passwordHash: string;

    @ApiProperty({
        example: 'lilwiggha',
        description: 'username пользователя',
    })
    @IsString()
    username: string;

    @ApiProperty({
        example: ['67347e122ffc01bfdb0f1d92', '67347e122ffc01bfdb0f1d93'],
        description: 'Ссылки на чаты добавленные пользователем',
    })
    chatReferences: string[];
}

export class FindUserByPhoneNumberRequestDTO {
    @ApiProperty({
        example: '+123456789',
        description: 'Номер телефона пользователя',
    })
    @IsString()
    phoneNumber: string;
}

export class FindUserByPhoneNumberResponseDTO {
    @ApiProperty({
        example: 12,
        description: 'id пользователя',
    })
    @IsNumber()
    userId: number;

    @ApiProperty({
        example: '+123456789',
        description: 'Номер телефона пользователя',
    })
    @IsString()
    phoneNumber: string;

    @ApiProperty({
        example: 'example@mail.ru',
        description: 'Почта пользователя',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '123456gew',
        description: 'Пароль пользователя',
    })
    @IsString()
    passwordHash: string;

    @ApiProperty({
        example: 'lilwiggha',
        description: 'username пользователя',
    })
    @IsString()
    username: string;
}

export class FindUserByEmailRequestDTO {
    @ApiProperty({
        example: 'example@mail.ru',
        description: 'Почта пользователя',
    })
    @IsEmail()
    email: string;
}

export class FindUserByEmailResponseDTO {
    @ApiProperty({
        example: 12,
        description: 'id пользователя',
    })
    @IsNumber()
    userId: number;

    @ApiProperty({
        example: '+123456789',
        description: 'Номер телефона пользователя',
    })
    @IsString()
    phoneNumber: string;
    @ApiProperty({
        example: 'example@mail.ru',
        description: 'Почта пользователя',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: '123456gew',
        description: 'Пароль пользователя',
    })
    @IsString()
    passwordHash: string;

    @ApiProperty({
        example: 'lilwiggha',
        description: 'username пользователя',
    })
    @IsString()
    username: string;
}

export class FindUserByUsernameRequestDTO {
    @ApiProperty({
        example: 'lilwiggha',
        description: 'username пользователя',
    })
    @IsString()
    username: string;
}

export class FindUserByUsernameResponseDTO {
    @ApiProperty({
        example: [{ userId: 12, username: 'lilwiggha' }],
        description: 'Массив пользователей',
    })
    userData: UserArray[];
}

export class UserArray {
    @ApiProperty({
        example: 12,
        description: 'id пользователя',
    })
    @IsNumber()
    userId: number;

    @ApiProperty({
        example: 'lilwiggha',
        description: 'username пользователя',
    })
    @IsString()
    username: string;
}
