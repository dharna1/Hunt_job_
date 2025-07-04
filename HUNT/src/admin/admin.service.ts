import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { User } from 'src/models/user.entity';
import { UserRole } from 'src/models/userRoles.entity';

@Injectable()
export class AdminService {
  async findAll(query: any): Promise<any> {
    const {
      name,
      email,
      phone,
      search,
      sortDirection = 'DESC',
      pageNumber = 0,
      pageSize = 10,
    } = query;

    const where: any = {};

    // Filters
    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
      where.email = { [Op.like]: `%${email}%` };
    }
    if (phone) {
      where.phone = { [Op.like]: `%${phone}%` };
    }

    // Search
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    // Pagination
    const pageNum = Number(pageNumber);
    const pageSz = Number(pageSize);
    const offset = pageNum * pageSz;

    // Query with sorting and pagination
    const admins = await User.findAndCountAll({
      where,
      include: [{ model: UserRole, include: ['role'] }],
      order: [['createdOn', sortDirection]],
      limit: pageSz,
      offset: offset,
    });

    return {
      users: admins.rows.map((user) => ({
        ...user.toJSON(),
        roles: user.userRoles.map((userRole) => userRole.role),
      })),
      totalItems: admins.count,
      currentPage: pageNum,
      totalPages: Math.ceil(admins.count / pageSz),
    };
  }
}
