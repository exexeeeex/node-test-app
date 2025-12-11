import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('date')
  birthday: Date

  @Column({ unique: true })
  email: string

  @Column()
  passwordHash: string

  @Column()
  passwordSalt: string

  @Column('boolean')
  isActive: boolean

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({name: 'roleId'})
  role: Role

  @Column({name: 'roleId'})
  roleId: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @Column('date', { nullable: true })
  blockedAt: Date
}
