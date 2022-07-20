import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn({ name: 'Balance_Id' })
  balance_id: number;

  @Column({ type: 'float', nullable: false, default: 0 })
  balance_money: number;

  @OneToOne(() => User, (User) => User.balance, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'User_Id' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
