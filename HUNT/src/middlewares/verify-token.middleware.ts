// NPM modules
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { AuthService } from './../auth/auth.service';
import { EmployeeService } from 'src/employee/employee.service';
import { EmployerService } from 'src/employer/employer.service';

@Injectable()
export class VerifyToken implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly employerService: EmployerService,
    private readonly employeeService: EmployeeService,
  ) {}

  async use(req: Request | any, res: Response, next: NextFunction) {
    let { token } = req.headers;
    const { authorization } = req.headers;
    if (!token) {
      token = authorization;
    }
    if (!token) {
      return res.status(400).json({
        success: false,
        errors: ['Please enter authorization token'],
      });
    }
    const { tokenReq, tokenPayload, fullToken } =
      this.authService.decodeAuthToken(token);
    if (!tokenPayload) {
      return res.status(401).json({
        success: false,
        errors: ['Invalid authorization token'],
      });
    }
    let user = null;
    try {
      // const jwtSecret = process.env.JWT_SECRET;
      // if (!this.authService.verifyAuthToken(token, jwtSecret)) {
      //   console.log(token, jwtSecret, 'entered');
      //   return res.status(401).json({
      //     success: false,
      //     errors: ['Authorization token is not valid'],
      //   });
      // }
      const { userId, role } = tokenPayload;
      const roles = Array.isArray(role) ? role : [role];
      if (roles.includes('EMPLOYER')) {
        user = await this.employerService.findUserById(userId);
        if (!user) {
          return res.status(401).json({
            success: false,
            errors: ['Employer not found'],
          });
        }
      } else if (roles.includes('EMPLOYEE')) {
        user = await this.employeeService.findUserById(userId);
        if (!user) {
          return res.status(401).json({
            success: false,
            errors: ['Employee not found'],
          });
        }
      } else if (roles.includes('ADMIN') || roles.includes('SUPER_ADMIN')) {
        user = await this.authService.findUserById(userId);
        if (!user) {
          return res.status(401).json({
            success: false,
            errors: ['User not found'],
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          errors: ['Invalid role'],
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        success: false,
        errors: ['Authorization token is not valid'],
      });
    }
    req.user = user;
    req.tokenReq = tokenReq;
    req.tokenPayload = tokenPayload;
    req.fullToken = fullToken;
    next();
  }
}
