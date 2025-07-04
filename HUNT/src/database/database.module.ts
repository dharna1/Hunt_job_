import { Module } from '@nestjs/common';
import databaseProviders from './database.provider';

@Module({
  providers: [...databaseProviders], // Register the providers
  exports: [...databaseProviders], // Export the providers for use in other modules
})
export class DatabaseModule {}
