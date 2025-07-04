import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles('ADMIN', 'SUPER_ADMIN')
  async getAllUsers(@Query() query: any) {
    const adminList = this.adminService.findAll(query);
    return adminList;
  }
}
