import { Test, TestingModule } from '@nestjs/testing';
import { HarborService } from './harbor.service';

describe('HarborService', () => {
  let service: HarborService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HarborService],
    }).compile();

    service = module.get<HarborService>(HarborService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
