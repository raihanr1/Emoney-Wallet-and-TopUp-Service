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
import {
  InquiryTransactionDto,
  PaymentTransactionDto,
} from './dto/inquiry-transaction.dto';
import { InvoiceTransactionDto } from './dto/invoice-transaction.dto';
import { UserTransactionService } from './user-transaction.service';
// only logged in user
@UseGuards(AuthenticationUserGuard)
@Controller('user-transaction')
export class UserTransactionController {
  constructor(
    private readonly userTransactionService: UserTransactionService,
  ) {}

  @HttpCode(200)
  @Get('biller-list')
  async getListBillerProduct(
    @Headers('payload_token') payload_token: UserAuthentication,
  ) {
    return this.userTransactionService.gettinBillerList();
  }

  @HttpCode(201)
  @Post('invoice')
  async createNewTransaction(
    @Headers('payload_token') payload_token: UserAuthentication,
    @Body(new ValidationPipe()) invoiceTransactionDto: InvoiceTransactionDto,
  ) {
    return await this.userTransactionService.createInvoiceTransaction(
      payload_token,
      invoiceTransactionDto,
    );
  }

  @HttpCode(200)
  @Get('inquiry')
  async gettingInquiryTransaction(
    @Headers('payload_token') payload_token: UserAuthentication,
    @Body(new ValidationPipe()) inquiryTransactionDto: InquiryTransactionDto,
  ) {
    return await this.userTransactionService.gettingInquiryTransaction(
      payload_token,
      inquiryTransactionDto,
    );
  }

  @HttpCode(201)
  @Post('payment')
  async confirmationTransactionPayment(
    @Headers('payload_token') payload_token: UserAuthentication,
    @Body(new ValidationPipe()) paymentTransactionDto: PaymentTransactionDto,
  ) {
    return await this.userTransactionService.confirmPaymentTransaction(
      payload_token,
      paymentTransactionDto,
    );
  }

  @HttpCode(200)
  @Get('history')
  async getTransactionHistory(
    @Headers('payload_token') payload_token: UserAuthentication,
  ) {
    return await this.userTransactionService.gettingHistoryUserTransaction(
      payload_token,
    );
  }
}
