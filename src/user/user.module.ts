import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BcryptModule } from '../bcrypt/bcrypt.module';
import { Balance } from '../entity/Balance';
import { Transaction } from '../entity/Transaction';
import { User } from '../entity/User';
import { HelperModule } from '../helper/helper.module';
import { JwtModule } from '../jwt/jwt.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Balance, Transaction]),
    HelperModule,
    JwtModule,
    BcryptModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
