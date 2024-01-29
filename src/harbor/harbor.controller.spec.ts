import { Test, TestingModule } from '@nestjs/testing';
import { HarborController } from './harbor.controller';

describe('HarborController', () => {
  let controller: HarborController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarborController],
    }).compile();

    controller = module.get<HarborController>(HarborController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
