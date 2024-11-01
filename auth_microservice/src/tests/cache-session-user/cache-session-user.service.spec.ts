import { Test, TestingModule } from '@nestjs/testing';
import { CacheSessionUserService } from '../../modules/cache-session-user/cache-session-user.service';

describe('CacheSessionUserService', () => {
    let service: CacheSessionUserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CacheSessionUserService],
        }).compile();

        service = module.get<CacheSessionUserService>(CacheSessionUserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
