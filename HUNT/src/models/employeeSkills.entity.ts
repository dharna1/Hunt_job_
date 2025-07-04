import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Employee } from './employee.entity';
import { Skill } from './skills.entity';

@Table({ tableName: 'EMPLOYEE_0_SKILLS', timestamps: false })
export class EmployeeSkills extends Model {
  @ForeignKey(() => Employee)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    primaryKey: true,
  })
  employeeId: bigint; // Correct field name for the foreign key

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
  })
  position: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  skills: bigint;

  @BelongsTo(() => Skill, {
    foreignKey: 'skills',
    targetKey: 'id',
    as: 'skillList',
  })
  skillList: Skill[];
}
