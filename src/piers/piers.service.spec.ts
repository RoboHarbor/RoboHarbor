import { Test, TestingModule } from '@nestjs/testing';
import { PiersService } from './piers.service';

describe('PiersService', () => {
  let service: PiersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PiersService],
    }).compile();

    service = module.get<PiersService>(PiersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
