import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { VerifyToken } from './middlewares/verify-token.middleware';
import { DatabaseModule } from './database/database.module';
import { AuthService } from './auth/auth.service';
import { EmployerModule } from './employer/employer.module';
import { EmployerService } from './employer/employer.service';
import { EmployeeModule } from './employee/employee.module';
import { AdminModule } from './admin/admin.module';
import { JobsModule } from './jobs/jobs.module';
import { SkillsModule } from './skills/skills.module';
import { ReasonsModule } from './reasons/reasons.module';
import { CompletenessPointsModule } from './completeness-points/completeness-points.module';
import admin from './config/firebase.config';
import { Config } from './config';
import { EmployeeService } from './employee/employee.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { EducationModule } from './education/education.module';
import { EducationService } from './education/education.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    EmployerModule,
    JwtModule.register({}),
    EmployeeModule,
    AdminModule,
    JobsModule,
    SkillsModule,
    ReasonsModule,
    CompletenessPointsModule,
    Config,
    DashboardModule,
    EducationModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    EmployerService,
    EmployeeService,
    EducationService,
    {
      provide: 'FIREBASE_ADMIN',
      useValue: admin,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: ['FIREBASE_ADMIN'],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(VerifyToken).exclude('auth/login', 'health').forRoutes('/');
  }
}
