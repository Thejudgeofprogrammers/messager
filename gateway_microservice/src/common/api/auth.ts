import * as dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT_NGINX;
const host = process.env.HOST_NGINX;

const descriptionApiLogoutCurl = `
    curl -X POST http://${host}:${port}/api/auth/logout \
    -H "Content-Type: application/json" \
    -H "Cookie: userId=12; jwtToken=27052b**********************4f7b87" \
    -d '{
        "userId": 12,
        "jwtToken": "27052b**********************4f7b87"
    }'
`;

const descriptionApiLogoutAxios = `
    await axios.post(
        'http://${host}:${port}/api/auth/logout',
        {
            userId: 12,
            jwtToken: '27052b**********************4f7b87',
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Для поддержки куки
        }
    );
`;

export const logoutDocs = `
    Выполнить запрос для выхода пользователя с аккаунта.\n\nПример curl:\n
    ${descriptionApiLogoutCurl}\n\nПример axios:\n${descriptionApiLogoutAxios}
`;

const descriptionApiLoginCurl = `
    curl -X POST http://${host}:${port}/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{
            "phoneNumber": "+1234567890",
            "email": "user@example.com",
            "password": "yourPassword123"
        }'
`;

const descriptionApiLoginAxios = `
    await axios.post(
        'http://${host}:${port}/api/auth/login',
        {
            phoneNumber: '+1234567890',
            email: 'user@example.com',
            password: 'yourPassword123',
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // Для поддержки куки
        }
    );
`;

export const loginDocs = `
    Выполнить запрос для входа пользователя в аккаунт.\n\nПример curl:\n
    ${descriptionApiLoginCurl}\n\nПример axios:\n${descriptionApiLoginAxios}
`;

const descriptionApiRegisterCurl = `
    curl -X POST http://${host}:${port}/api/auth/register \
        -H "Content-Type: application/json" \
        -d '{
            "username": "username",
            "email": "example@mail.ru",
            "password": "yourPassword123",
            "phoneNumber": "+123456789"
        }'
`;

const descriptionApiRegisterAxios = `
    await axios.post(
        'http://${host}:${port}/api/auth/register',
        {
            username: 'username',
            email: 'example@mail.ru',
            password: 'yourPassword123',
            phoneNumber: '+123456789',
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );
`;

export const RegisterDocs = `
    Выполнить запрос для создания аккаунта.\n\nПример curl:\n
    ${descriptionApiRegisterCurl}\n\nПример axios:\n${descriptionApiRegisterAxios}
`;
