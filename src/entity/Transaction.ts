import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

export enum StatusTransaction {
  Expired = 'Expired',
  Awaiting = 'Awaiting',
  Success = 'Success',
  Refund = 'Refund',
}

export enum TransactionType {
  Topup = 'Top Up Balance',
  BillerTransaction = 'Biller Transaction',
  PaymentBillerTransaction = 'Payment Biller Transaction',
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  transaction_id: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
    nullable: false,
  })
  transaction_type: TransactionType;

  @Column({
    type: 'enum',
    enum: StatusTransaction,
    nullable: false,
    default: StatusTransaction.Awaiting,
  })
  status: StatusTransaction;

  @Column({ type: 'tinyint', default: null, nullable: true })
  biller_id: number;

  @Column({ type: 'float', default: null, nullable: true })
  topup_amount: number;

  @Column({ type: 'float', default: null, nullable: true })
  payment_amount: number;

  @ManyToOne(() => User, (User) => User.id)
  @JoinColumn({ name: 'User_Id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
