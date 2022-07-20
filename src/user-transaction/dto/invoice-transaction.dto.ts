import { IsNotEmpty, IsNumber } from 'class-validator';

export class InvoiceTransactionDto {
  @IsNotEmpty({
    message: 'biller_id is required',
  })
  @IsNumber()
  biller_id: number;
}
