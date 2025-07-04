import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  Unique,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserRole } from './userRoles.entity';
import { Role } from './roles.entity';

@Table({
  tableName: 'USERS_0',
  timestamps: false,
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email: string;

  @Unique
  @Column({
    type: DataType.STRING(15),
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  token: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  isActive: boolean;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  isDeleted: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLoginDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  createdOn: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updatedOn: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  uid: string;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  receiveNotification: boolean;

  @HasMany(() => UserRole)
  userRoles: UserRole[];

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];
}
