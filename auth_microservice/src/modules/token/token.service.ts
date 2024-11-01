import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    async generateToken(payload: any): Promise<string> {
        try {
            return this.jwtService.sign(payload);
        } catch (e) {
            throw new Error(e);
        }
    }

    async verifyToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (e) {
            throw new Error('Invalid token');
        }
    }

    decodeToken(token: string): any {
        return this.jwtService.decode(token);
    }
}
