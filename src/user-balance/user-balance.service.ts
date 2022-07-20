import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Balance } from '../entity/Balance';
import { User } from '../entity/User';
import { JwtService } from '../jwt/jwt.service';
import { UserAuthentication } from '../user/user-authentication.dto';
import { UserBalanceTopupDto } from './dto/user-balance-topup-dto';

@Injectable()
export class UserBalanceService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Balance)
    private balancesRepository: Repository<Balance>,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async getUserBalance(email_address: string, username: string) {
    return await this.usersRepository.findOne({
      where: {
        email_address,
        username,
      },
      relations: ['balance'],
    });
  }

  async gettingUserBalanceData(payload_token: UserAuthentication) {
    const { email_address, username } = payload_token;
    const getUserBalanceData = await this.getUserBalance(
      email_address,
      username,
    );
    return {
      statusCode: 200,
      data: {
        balance: getUserBalanceData.balance,
      },
    };
  }

  async responseUserBalanceTopUp(
    payload_token: UserAuthentication,
    userBalanceTopupDto: UserBalanceTopupDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const { email_address, username } = payload_token;
      const { balance_money } = userBalanceTopupDto;
      const getUserBalanceData = await this.getUserBalance(
        email_address,
        username,
      );
      const balanceBefore = getUserBalanceData.balance.balance_money;
      getUserBalanceData.balance.balance_money = balanceBefore + balance_money;
      const updateBalance = await queryRunner.manager.save(
        getUserBalanceData.balance,
      );

      //   create trx
      await queryRunner.commitTransaction();
      return {
        statusCode: 201,
        message: `Success Top Up User Balance`,
        data: {
          topup_balance: balance_money,
          previous_balance: balanceBefore,
          current_balance: updateBalance.balance_money,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return error;
    } finally {
      await queryRunner.release();
    }
  }
}
