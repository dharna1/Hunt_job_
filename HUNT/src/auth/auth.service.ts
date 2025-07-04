// NPM modules
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './auth.interface';
import { User } from 'src/models/user.entity';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Role } from 'src/models/roles.entity';
import { CreateUserDto } from './auth-dto/auth-dto';
import admin from '../config/firebase.config';
import * as sendGrid from '@sendgrid/mail';

// Models

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }
  /**
   * @param authToken string
   * @returns
   */
  decodeAuthToken(authToken: string): {
    tokenReq: string;
    tokenPayload: TokenPayload;
    fullToken: string;
  } {
    const authTokenArray = authToken.split(' ');
    if (authTokenArray.length > 1) {
      const tokenPayload = this.jwtService.decode<TokenPayload>(
        authTokenArray[1],
      );
      return {
        tokenReq: authTokenArray[1],
        tokenPayload,
        fullToken: authToken,
      };
    }
    const tokenPayload = this.jwtService.decode<TokenPayload>(authToken);
    return { tokenReq: authToken, tokenPayload, fullToken: authToken };
  }
  /**
   * @param authToken
   * @returns
   */
  verifyAuthToken(authToken: string, secret: string = null): any {
    const jwtSecret = secret || process.env.JWT_SECRET;
    const authTokenArray = authToken.split(' ');

    const token =
      authTokenArray.length > 1 ? authTokenArray[1] : authTokenArray[0];
    return this.jwtService.verify(token, { secret: jwtSecret });
  }

  /**
   * @param email
   * @returns
   */
  async findUserByEmail(email: string): Promise<any> {
    return User.findOne({ where: { email } });
  }

  async findUserById(id: any): Promise<any> {
    return User.findByPk(id);
  }

  async findUserByUid(uid: any): Promise<any> {
    return User.findOne({
      where: { uid },
    });
  }

  /**
   * Compares the provided password with the hashed password.
   * @param password - The plain text password provided by the user.
   * @param passwordHash - The hashed password stored in the database.
   * @returns - True if passwords match, otherwise false.
   */
  async compareUserPassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  /**
   * @param payload
   * @returns
   */
  async generateJWTToken(
    payload: any,
    secret: string = process.env.JWT_SECRET,
  ): Promise<any> {
    const currentTime = Date.now();
    const tokenPayload = {
      ...payload,
      time: currentTime,
    };
    if (secret) {
      return this.jwtService.sign(tokenPayload, { secret });
    }
    return this.jwtService.sign(tokenPayload);
  }

  /**
   * @returns
   */
  public generateUniqueId(): string {
    return uuid.v4();
  }

  /**
   *
   * @param data
   * @returns
   */
  async createUser(createUserDto: CreateUserDto): Promise<any> {
    const userRecord = await admin.auth().createUser({
      email: createUserDto.email,
      password: createUserDto.password,
    });
    delete createUserDto.confirmPassword;
    const user = await User.create({
      uid: userRecord.uid,
      name: createUserDto.name,
      email: createUserDto.email,
      isActive: true,
      isDeleted: false,
    });
    const roles = await Role.findAll({
      where: { role: createUserDto.roles },
    });

    await user.$set('roles', roles);
    try {
      await this.sendWelcomeEmail(createUserDto.email, createUserDto.password);
    } catch (emailError) {
      return {
        message: 'User created successfully, but mail not sent.',
        firebaseUser: userRecord,
        data: user,
      };
      console.error('Error sending email:', emailError);
    }

    return {
      message: 'User created successfully',
      firebaseUser: userRecord,
      data: user,
    };
  }

  /**
   *
   * @returns
   */
  async getRoles(): Promise<any> {
    return await Role.findAll();
  }

  private async sendWelcomeEmail(
    email: string,
    password: string,
  ): Promise<void> {
    const message = {
      to: email,
      from: process.env.MAIL_FROM,
      subject: 'Welcome to Hunt',
      text: `Hello! Your account has been successfully created. Here are your login credentials:
      
      Email: ${email}
      Password: ${password}
      
      Please change your password after logging in for the first time.`,
      html: `<p>Hello! Your account has been successfully created. Here are your login credentials:</p>
             <p>Email: <strong>${email}</strong></p>
             <p>Password: <strong>${password}</strong></p>
             <p>Please change your password after logging in for the first time.</p>`,
    };

    await sendGrid.send(message);
  }
}
