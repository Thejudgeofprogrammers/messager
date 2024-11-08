export interface LoginFormDTO {
    phoneNumber?: string | undefined;
    email?: string | undefined;
    password: string;
}

export interface LogoutDTO {
    userId: number;
    jwtToken: string;
}
