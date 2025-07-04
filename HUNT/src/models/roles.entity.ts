import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserRole } from './userRoles.entity';
import { User } from './user.entity';

@Table({
  tableName: 'ROLES',
  timestamps: false,
})
export class Role extends Model<Role> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  role: string;

  // Many-to-many relationship with User model
  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}
