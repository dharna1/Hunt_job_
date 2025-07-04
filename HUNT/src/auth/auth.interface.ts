export interface IUser {
  id?: number;
  name: string;
  email: string;
  password?: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRole {
  id?: number;
  name: string;
  authorities: number[];
}

export interface IAuthority {
  id?: number;
  name: string;
}

export interface TokenPayload {
  name: string;
  email: string;
  userId: number;
  role: string[];
}
