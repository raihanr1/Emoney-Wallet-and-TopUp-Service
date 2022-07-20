import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserBalanceTopupDto {
  @IsNotEmpty({
    message: 'balance_money is required',
  })
  @IsNumber()
  balance_money: number;
}
