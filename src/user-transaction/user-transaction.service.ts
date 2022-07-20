import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { DataSource, Repository } from 'typeorm';
import { Balance } from '../entity/Balance';
import {
  StatusTransaction,
  Transaction,
  TransactionType,
} from '../entity/Transaction';
import { User } from '../entity/User';
import { UserAuthentication } from '../user/user-authentication.dto';
import { InvoiceTransactionDto } from './dto/invoice-transaction.dto';
import { v4 as uuidv4 } from 'uuid';
import {
  InquiryTransactionDto,
  PaymentTransactionDto,
} from './dto/inquiry-transaction.dto';

@Injectable()
export class UserTransactionService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Balance)
    private balancesRepository: Repository<Balance>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  async getUser(username: string, email_address: string) {
    return await this.usersRepository.findOne({
      where: {
        username,
        email_address,
      },
    });
  }

  async gettinBillerList() {
    const billerListData = await lastValueFrom(
      this.httpService.request({
        method: 'GET',
        url: 'https://phoenix-imkas.ottodigital.id/interview/biller/v1/list',
      }),
    );
    return {
      statusCode: 200,
      message: 'Success',
      data: billerListData.data.data,
    };
  }

  async createInvoiceTransaction(
    payload_token: UserAuthentication,
    invoiceTransactionDto: InvoiceTransactionDto,
  ) {
    const getUser = await this.getUser(
      payload_token.username,
      payload_token.email_address,
    );
    const billerDataDetail = await lastValueFrom(
      this.httpService.request({
        method: 'GET',
        url: `https://phoenix-imkas.ottodigital.id/interview/biller/v1/detail?billerId=${invoiceTransactionDto.biller_id}`,
      }),
    );
    if (billerDataDetail.data.code !== 200 && !billerDataDetail.data.data) {
      throw new NotFoundException('Biller Not Found');
    }
    const newTransaction = new Transaction();
    newTransaction.transaction_id = uuidv4();
    newTransaction.transaction_type = TransactionType.BillerTransaction;
    newTransaction.status = StatusTransaction.Awaiting;
    newTransaction.biller_id = billerDataDetail.data.data.id;
    newTransaction.user = getUser;
    const priceTrx = billerDataDetail.data.data.price;
    const feeTrx = billerDataDetail.data.data.fee;
    newTransaction.payment_amount = priceTrx + feeTrx;
    const createNewInvoice = await this.transactionRepository.save(
      newTransaction,
    );
    return {
      statusCode: 201,
      message: 'Success Create Biller Transaction',
      data: {
        transaction_id: createNewInvoice.transaction_id,
      },
    };
  }

  async gettingInquiryTransaction(
    payload_token: UserAuthentication,
    inquiryTransactionDto: InquiryTransactionDto,
  ) {
    const getInquiryTrx = await this.transactionRepository.findOne({
      where: {
        transaction_id: inquiryTransactionDto.transaction_id,
        transaction_type: TransactionType.BillerTransaction,
      },
      select: [
        'biller_id',
        'created_at',
        'status',
        'transaction_id',
        'transaction_type',
        'payment_amount',
      ],
    });

    if (!getInquiryTrx) {
      throw new NotFoundException('Inquiry Transaction Not Found');
    }
    const billerDataDetail = await lastValueFrom(
      this.httpService.request({
        method: 'GET',
        url: `https://phoenix-imkas.ottodigital.id/interview/biller/v1/detail?billerId=${getInquiryTrx.biller_id}`,
      }),
    );
    return {
      statusCode: 200,
      message: 'Success',
      data: {
        inquiry: {
          ...getInquiryTrx,
          biller_detail: {
            ...billerDataDetail.data.data,
          },
        },
      },
    };
  }

  async confirmPaymentTransaction(
    payload_token: UserAuthentication,
    paymentTransactionDto: PaymentTransactionDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const getUser = await this.usersRepository.findOne({
        where: {
          username: payload_token.username,
          email_address: payload_token.email_address,
        },
        relations: ['balance'],
      });
      const getInquiryTrx = await this.gettingInquiryTransaction(
        payload_token,
        paymentTransactionDto,
      );
      const userBalance = getUser.balance.balance_money;
      const payment_total = getInquiryTrx.data.inquiry.payment_amount;
      const updateSaldo = userBalance - payment_total;
      if (updateSaldo < 0) {
        throw new BadRequestException(
          'Validation failed',
          'Balance not enough, Please Top Up First. And Try To Make a Payment Again',
        );
      }
      const updatedBalance = await queryRunner.manager.save(Balance, {
        ...getUser.balance,
        balance_money: updateSaldo,
      });
      const updatePaymentTrx = new Transaction();
      updatePaymentTrx.transaction_id = paymentTransactionDto.transaction_id;
      updatePaymentTrx.status = StatusTransaction.Success;
      updatePaymentTrx.transaction_type =
        TransactionType.PaymentBillerTransaction;
      const updatedTrx = await queryRunner.manager.save(
        Transaction,
        updatePaymentTrx,
      );
      await queryRunner.commitTransaction();
      return {
        statusCode: 201,
        message: 'Success Update Payment Transaction',
        data: {
          balance: updatedBalance,
          transaction: {
            transaction_id: updatePaymentTrx.transaction_id,
            status: updatePaymentTrx.status,
            transaction_type: updatePaymentTrx.transaction_type,
          },
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async gettingHistoryUserTransaction(payload_token: UserAuthentication) {
    const { username, email_address } = payload_token;
    const getUser = await this.usersRepository.findOne({
      where: {
        username,
        email_address,
      },
      relations: ['transaction'],
      order: {
        transaction: {
          updated_at: 'DESC',
        },
      },
    });
    return {
      statusCode: 200,
      message: 'Success',
      data: getUser.transaction,
    };
  }
}
