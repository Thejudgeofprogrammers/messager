import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {
    async hashPassword(password: string): Promise<string> {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }

    async comparePassword(password: string, hashedPassword): Promise<boolean> {
        const checkPassword = await bcrypt.compare(password, hashedPassword);
        return checkPassword;
    }
}
