import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Employee } from './employee.entity';
import { Personality } from './personality.entity';

@Table({ tableName: 'EMPLOYEE_0_PERSONALITIES', timestamps: false })
export class EmployeePersonality extends Model<EmployeePersonality> {
  @ForeignKey(() => Employee)
  @Column
  employeeId: number;

  @Column({ primaryKey: true })
  position: number;

  @Column
  personalities: number | null;

  @BelongsTo(() => Personality, {
    foreignKey: 'personalities',
    targetKey: 'personalityId',
    as: 'personalityDetails',
  })
  personalityDetails: Personality[];
}
