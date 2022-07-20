import { Test, TestingModule } from '@nestjs/testing';
import { UserTransactionService } from './user-transaction.service';

describe('UserTransactionService', () => {
  let service: UserTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTransactionService],
    }).compile();

    service = module.get<UserTransactionService>(UserTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
