import { Test, TestingModule } from '@nestjs/testing';
import { UserTransactionController } from './user-transaction.controller';

describe('UserTransactionController', () => {
  let controller: UserTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTransactionController],
    }).compile();

    controller = module.get<UserTransactionController>(UserTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
