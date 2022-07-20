import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Balance } from '../entity/Balance';
import { Transaction } from '../entity/Transaction';
import { User } from '../entity/User';
import { HelperModule } from '../helper/helper.module';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';
import { UserBalanceController } from './user-balance.controller';
import { UserBalanceService } from './user-balance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Balance, Transaction]),
    HelperModule,
    JwtModule,
  ],
  controllers: [UserBalanceController],
  providers: [UserBalanceService],
})
export class UserBalanceModule {}
