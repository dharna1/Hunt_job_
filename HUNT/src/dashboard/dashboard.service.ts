import { Injectable } from '@nestjs/common';
import { Employee } from 'src/models/employee.entity';
import { Op, Sequelize } from 'sequelize';
import { Employer } from 'src/models/employer.entity';
import { SuspiciousEmployee } from 'src/models/suspiciousEmployee.entity';
import { Job } from 'src/models/job.entity';
import { Swipe } from 'src/models/swipe.entity';

@Injectable()
export class DashboardService {
  async getCountByMonthAndYear(query: any): Promise<{
    org: { monthCount: number; yearCount: number };
    jobSeekers: { monthCount: number; yearCount: number };
  }> {
    const { month, year } = query;

    // Default to current month and year if not provided
    const currentDate = new Date();
    const targetMonth = month ? Number(month) - 1 : currentDate.getMonth();
    const targetYear = year ? Number(year) : currentDate.getFullYear();

    // Calculate the start and end of the month
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(
      targetYear,
      targetMonth + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Calculate the start and end of the year
    const startOfYear = new Date(targetYear, 0, 1);
    const endOfYear = new Date(targetYear, 11, 31, 23, 59, 59, 999);

    const monthCountOrg = await Employer.count({
      where: {
        createdOn: {
          [Op.gte]: startOfMonth,
          [Op.lte]: endOfMonth,
        },
      },
    });
    const yearCountOrg = await Employer.count({
      where: {
        createdOn: {
          [Op.gte]: startOfYear,
          [Op.lte]: endOfYear,
        },
      },
    });

    // Monthly and yearly counts for job seekers
    const monthCountJobSeekers = await Employee.count({
      where: {
        createdOn: {
          [Op.gte]: startOfMonth,
          [Op.lte]: endOfMonth,
        },
      },
    });
    const yearCountJobSeekers = await Employee.count({
      where: {
        createdOn: {
          [Op.gte]: startOfYear,
          [Op.lte]: endOfYear,
        },
      },
    });

    return {
      org: {
        monthCount: monthCountOrg,
        yearCount: yearCountOrg,
      },
      jobSeekers: {
        monthCount: monthCountJobSeekers,
        yearCount: yearCountJobSeekers,
      },
    };
  }

  async getMonthlyStatsForLastFiveMonths(): Promise<{
    org: { [key: string]: number };
    jobSeekers: { [key: string]: number };
  }> {
    const currentDate = new Date();
    const monthNames = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ];

    const orgCounts: { [key: string]: number } = {};
    const jobSeekersCounts: { [key: string]: number } = {};

    for (let i = 0; i < 5; i++) {
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      const monthName = monthNames[targetDate.getMonth()];

      const startOfMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      // Count for employers
      const orgCount = await Employer.count({
        where: {
          createdOn: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      // Count for job seekers
      const jobSeekersCount = await Employee.count({
        where: {
          createdOn: {
            [Op.gte]: startOfMonth,
            [Op.lte]: endOfMonth,
          },
        },
      });

      orgCounts[monthName] = orgCount;
      jobSeekersCounts[monthName] = jobSeekersCount;
    }

    return {
      org: orgCounts,
      jobSeekers: jobSeekersCounts,
    };
  }

  async getReportedJobSeekerStats(query: any): Promise<{
    count: number;
  }> {
    const { month, year } = query;

    // Default to current month and year if not provided
    const currentDate = new Date();
    const targetMonth = month ? Number(month) - 1 : currentDate.getMonth(); // 0-based month (0 = January)
    const targetYear = year ? Number(year) : currentDate.getFullYear();

    // Calculate the start and end of the month for filtering
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(
      targetYear,
      targetMonth + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Get the count of suspicious employees for the given month
    const monthCountJobSeekers = await SuspiciousEmployee.count({
      where: {
        reportedOn: {
          [Op.gte]: startOfMonth,
          [Op.lte]: endOfMonth,
        },
      },
    });

    return {
      count: monthCountJobSeekers,
    };
  }

  async getJobStats(query: any): Promise<{
    count: number;
  }> {
    const { month, year } = query;

    // Default to current month and year if not provided
    const currentDate = new Date();
    const targetMonth = month ? Number(month) - 1 : currentDate.getMonth(); // 0-based month (0 = January)
    const targetYear = year ? Number(year) : currentDate.getFullYear();

    // Calculate the start and end of the month for filtering
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(
      targetYear,
      targetMonth + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Get the count of suspicious employees for the given month
    const monthCountJobs = await Job.count({
      where: {
        createdOn: {
          [Op.gte]: startOfMonth,
          [Op.lte]: endOfMonth,
        },
      },
    });

    return {
      count: monthCountJobs,
    };
  }

  async getPerfectMatchCountForMonth(query: any): Promise<{ count: number }> {
    const { month, year } = query;

    // Default to current month and year if not provided
    const currentDate = new Date();
    const targetMonth = month ? Number(month) - 1 : currentDate.getMonth(); // 0-based month
    const targetYear = year ? Number(year) : currentDate.getFullYear();

    // Calculate the start and end of the month
    const startOfMonth = new Date(targetYear, targetMonth, 1);
    const endOfMonth = new Date(
      targetYear,
      targetMonth + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Query for perfect matches where both swipes are 1, using the earliest of swipe times
    const perfectMatchCount = await Swipe.count({
      where: {
        employerSwipe: 1,
        employeeSwipe: 1,
        [Op.and]: [
          {
            [Op.or]: [
              {
                employeeSwipeTime: {
                  [Op.between]: [startOfMonth, endOfMonth],
                },
              },
              {
                employerSwipeTime: {
                  [Op.between]: [startOfMonth, endOfMonth],
                },
              },
            ],
          },
          {
            [Op.or]: [
              {
                employeeSwipeTime: {
                  [Op.lte]: Sequelize.fn(
                    'LEAST',
                    Sequelize.col('employeeSwipeTime'),
                    Sequelize.col('employerSwipeTime'),
                  ),
                },
              },
              {
                employerSwipeTime: {
                  [Op.lte]: Sequelize.fn(
                    'LEAST',
                    Sequelize.col('employeeSwipeTime'),
                    Sequelize.col('employerSwipeTime'),
                  ),
                },
              },
            ],
          },
        ],
      },
    });

    return { count: perfectMatchCount };
  }
}
