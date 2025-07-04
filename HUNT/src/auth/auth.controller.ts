import {
  Body,
  Controller,
  Post,
  Get,
  Res,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppError } from 'src/utils/appError';
import { CreateUserDto, LoginDto } from './auth-dto/auth-dto';
import { Response, Request } from 'express';
import admin from '../config/firebase.config';
import { UserRole } from 'src/models/userRoles.entity';
import { Role } from 'src/models/roles.entity';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<any> {
    try {
      const idTokenHeader =
        req.headers['token'] || req.headers.authorization?.split(' ')[1];
      const idToken = Array.isArray(idTokenHeader)
        ? idTokenHeader[1]
        : idTokenHeader;
      if (!idToken) {
        return res
          .status(401)
          .json(new AppError(401).addDbError('No ID token provided'));
      }

      // Verify the Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid } = decodedToken;
      const userInfoFromDb = await this.authService.findUserByUid(uid);
      if (!userInfoFromDb) {
        return res
          .status(404)
          .json(new AppError(404).addDbError('User not found'));
      }

      // Fetch all roles associated with the user using UserRole
      const userRoles = await UserRole.findAll({
        where: { user_id: userInfoFromDb.id },
        include: [{ model: Role, attributes: ['role'] }],
      });

      // Extract role names into an array
      const role = userRoles.map((userRole) => userRole.role.role);

      const accessToken = await this.authService.generateJWTToken({
        userId: userInfoFromDb.id,
        role: role,
      });

      await userInfoFromDb.update({ token: accessToken });

      return res
        .status(200)
        .json({ userName: userInfoFromDb.name, accessToken });
    } catch (e) {
      console.error('Error caught:', e);
      if (e instanceof AppError) {
        return res.status(e.getStatusCode()).json(e);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Post('/createUser')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Roles('ADMIN', 'SUPER_ADMIN')
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const userInfo = await this.authService.findUserByEmail(
        createUserDto.email,
      );

      if (userInfo) {
        return res
          .status(409)
          .json(
            new AppError(409).addDbError('User with this email already exists'),
          );
      }
      if (createUserDto.roles.length === 0) {
        return res
          .status(409)
          .json(new AppError(409).addDbError('role required'));
      }

      const user = await this.authService.createUser(createUserDto);
      return res.status(201).json({ user });
    } catch (e) {
      console.error(e); // Log the error for debugging
      if (e instanceof AppError) {
        return res.status(e.getStatusCode()).json(e);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body('email') email: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      if (!email) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('Email is required'));
      }
      const decodedToken = await admin.auth().getUserByEmail(email);
      if (!decodedToken) {
        return res
          .status(400)
          .json(new AppError(400).addDbError('Email not found'));
      }
      await admin.auth().generatePasswordResetLink(email);

      return res.status(200).json({
        message: 'Password reset link has been sent to your email.',
      });
    } catch (e) {
      console.error('Error in resetPassword API:', e);
      // Firebase-specific error handling
      if (e.code === 'auth/user-not-found') {
        return res
          .status(404)
          .json(new AppError(404).addDbError('User not found with this email'));
      }

      // Handle any other errors
      return res
        .status(500)
        .json(
          new AppError(500).addServerError('Unable to process your request'),
        );
    }
  }

  @Get('/roles')
  @Roles('ADMIN', 'SUPER_ADMIN')
  async getRoles(@Res() res: Response): Promise<any> {
    try {
      const data = await this.authService.getRoles();
      res.status(200).json({ data });
    } catch (e) {
      if (e instanceof AppError) {
        return res.status(e.getStatusCode()).json(e);
      } else {
        return res
          .status(500)
          .json(
            new AppError(500).addServerError('Unable to process your request'),
          );
      }
    }
  }
}
