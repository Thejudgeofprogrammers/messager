import { Test, TestingModule } from '@nestjs/testing';
import { CacheSessionUserController } from '../../modules/cache-session-user/cache-session-user.controller';

describe('CacheSessionUserController', () => {
    let controller: CacheSessionUserController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CacheSessionUserController],
        }).compile();

        controller = module.get<CacheSessionUserController>(
            CacheSessionUserController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
