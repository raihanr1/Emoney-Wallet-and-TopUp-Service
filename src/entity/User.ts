import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Balance } from './Balance';
import { Transaction } from './Transaction';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'User_Id' })
  id: number;

  @Column({ type: 'varchar', length: 120, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  email_address: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  password: string;

  @OneToOne(() => Balance, (Balance) => Balance.user, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'Balance_Id' })
  balance: Balance;

  @OneToMany(() => Transaction, (Transaction) => Transaction.user)
  transaction: Transaction;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
