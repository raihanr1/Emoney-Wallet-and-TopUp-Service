import { Module } from '@nestjs/common';
import { UserTransactionService } from './user-transaction.service';
import { UserTransactionController } from './user-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/User';
import { Balance } from '../entity/Balance';
import { Transaction } from '../entity/Transaction';
import { HelperModule } from '../helper/helper.module';
import { JwtModule } from '../jwt/jwt.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Balance, Transaction]),
    HelperModule,
    JwtModule,
    HttpModule,
  ],
  providers: [UserTransactionService],
  controllers: [UserTransactionController],
})
export class UserTransactionModule {}
