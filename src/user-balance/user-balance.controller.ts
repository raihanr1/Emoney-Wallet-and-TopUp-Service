import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationUserGuard } from '../authentication-user.guard';
import { UserAuthentication } from '../user/user-authentication.dto';
import { ValidationPipe } from '../validation.pipe';
import { UserBalanceTopupDto } from './dto/user-balance-topup-dto';
import { UserBalanceService } from './user-balance.service';

// only logged in user

@UseGuards(AuthenticationUserGuard)
@Controller('user-balance')
export class UserBalanceController {
  constructor(private readonly userBalanceService: UserBalanceService) {}

  @HttpCode(200)
  @Get('')
  async getUserBalance(
    @Headers('payload_token') payload_token: UserAuthentication,
  ) {
    return this.userBalanceService.gettingUserBalanceData(payload_token);
  }

  @HttpCode(201)
  @Post('')
  async UserBalanceTopUp(
    @Headers('payload_token') payload_token: UserAuthentication,
    @Body(new ValidationPipe()) userBalanceTopupDto: UserBalanceTopupDto,
  ) {
    return this.userBalanceService.responseUserBalanceTopUp(
      payload_token,
      userBalanceTopupDto,
    );
  }
}
