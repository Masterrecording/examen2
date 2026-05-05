import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity({ name: 'customers' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', type: 'varchar', length: 150, nullable: true })
  nombre: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 150,
    unique: true,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'username',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
    nullable: true,
  })
  password: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;
}