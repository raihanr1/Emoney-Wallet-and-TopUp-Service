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

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  transaction_id: string;

  @Column({
    type: 'enum',
    enum: StatusTransaction,
    nullable: false,
    default: StatusTransaction.Awaiting,
  })
  status: StatusTransaction;

  @Column({ type: 'tinyint' })
  biller_id: number;

  @ManyToOne(() => User, (User) => User.id)
  @JoinColumn({ name: 'User_Id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
