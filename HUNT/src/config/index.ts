// NPM modules
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({
  path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

export interface ConfigInterface {
  APP_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  APP_NAME: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  SWIPE_ENTRY_URL: string;
  SENDGRID_API_KEY: string;
}

export class Config implements ConfigInterface {
  public APP_PORT: number;
  public DB_USERNAME: string;
  public DB_PASSWORD: string;
  public DB_HOST: string;
  public DB_PORT: number;
  public DB_NAME: string;
  public APP_NAME: string;
  public FIREBASE_PROJECT_ID: string;
  public FIREBASE_CLIENT_EMAIL: string;
  public FIREBASE_PRIVATE_KEY: string;
  public SWIPE_ENTRY_URL: string;
  public SENDGRID_API_KEY: string;

  public constructor() {
    this.APP_PORT = Number(process.env.APP_PORT);
    this.DB_USERNAME = process.env.DB_USERNAME;
    this.DB_PASSWORD = process.env.DB_PASSWORD;
    this.DB_HOST = process.env.DB_HOST;
    this.DB_PORT = Number(process.env.DB_PORT);
    this.DB_NAME = process.env.DB_NAME;
    this.APP_NAME = 'ADMIN';
    this.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;
    this.FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL;
    this.SWIPE_ENTRY_URL = process.env.SWIPE_ENTRY_URL;
    this.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY?.replace(
      /\\n/g,
      '\n',
    );
    this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

    // Logs the env variables
    console.log('process.env.NODE_ENV :', process.env.NODE_ENV);
    console.log('process.env.APP_PORT :', process.env.APP_PORT);
    console.log('process.env.DB_NAME :', process.env.DB_NAME);
    console.log('process.env.DB_HOST :', process.env.DB_HOST);
    console.log('process.env.DB_PORT :', process.env.DB_PORT);
    console.log('process.env.SENDGRID_API_KEY :', process.env.SENDGRID_API_KEY);
    console.log(
      'process.env.FIREBASE_PROJECT_ID :',
      process.env.FIREBASE_PROJECT_ID,
    );
    console.log('process.env.SWIPE_ENTRY_URL', process.env.SWIPE_ENTRY_URL);
  }
}
export default new Config();
