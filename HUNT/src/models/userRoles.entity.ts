import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Role } from './roles.entity';

@Table({
  tableName: 'USER_ROLES',
  timestamps: false,
})
export class UserRole extends Model<UserRole> {
  @ForeignKey(() => User)
  @Column
  user_id: number;

  @ForeignKey(() => Role)
  @Column
  role_id: number;

  @BelongsTo(() => Role) // Define the association to Role
  role: Role;
}
