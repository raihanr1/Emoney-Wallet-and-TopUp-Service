import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class InquiryTransactionDto {
  @IsNotEmpty({
    message: 'transaction_id is required',
  })
  @IsString()
  @IsUUID()
  transaction_id: string;
}

export class PaymentTransactionDto {
  @IsNotEmpty({
    message: 'transaction_id is required',
  })
  @IsString()
  @IsUUID()
  transaction_id: string;
}
