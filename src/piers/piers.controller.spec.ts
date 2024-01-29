import { Test, TestingModule } from '@nestjs/testing';
import { PiersController } from './piers.controller';

describe('PiersController', () => {
  let controller: PiersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PiersController],
    }).compile();

    controller = module.get<PiersController>(PiersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
