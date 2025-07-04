import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Employer } from 'src/models/employer.entity';
import { EmployerMedia } from 'src/models/employerMedia.entity';
import {
  EmployerDocumentDto,
  UpdateEmployerDto,
} from './employer-dto/employer-dto';
import { Location } from 'src/models/location.entity';
import { EmployerAward } from 'src/models/employerAwards.entity';
import { EmployerIndustry } from 'src/models/employerIndustry.entity';
import { Industry } from 'src/models/industry.entity';
import { Job } from 'src/models/job.entity';
import { EmployerDocument } from 'src/models/employerDocument.entity';

const profileWeightage = {
  companyName: 15,
  about: 10,
  industry: 15,
  webSite: 10,
  culture: 10,
  benefits: 5,
  awards: 10,
  profilePhoto: 10,
  location: 10,
  headline: 5,
};

@Injectable()
export class EmployerService {
  async findAll(query: any): Promise<any> {
    const {
      accountStatus,
      employerName,
      phoneNumber,
      employerId,
      approved,
      createdOnStart,
      createdOnEnd,
      search,
      sortDirection = 'DESC',
      pageNumber = 0,
      pageSize = 10,
    } = query;

    const where: any = {};

    if (accountStatus) {
      where.accountStatus = accountStatus;
    }
    if (employerName) {
      where.employerName = employerName;
    }
    if (phoneNumber) {
      where.phoneNumber = phoneNumber;
    }
    if (employerId) {
      where.employerId = employerId;
    }
    if (approved) {
      where.approved = approved;
    }
    if (createdOnStart || createdOnEnd) {
      where.createdOn = {};
      if (createdOnStart) {
        where.createdOn[Op.gte] = new Date(createdOnStart);
      }
      if (createdOnEnd) {
        const endOfDay = new Date(createdOnEnd);
        endOfDay.setHours(23, 59, 59, 999);
        where.createdOn[Op.lte] = endOfDay;
      }
    }

    if (search) {
      where[Op.or] = [
        { employerName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phoneNumber: { [Op.like]: `%${search}%` } },
        { organizationName: { [Op.like]: `%${search}%` } },
      ];
    }

    const pageNum = Number(pageNumber);
    const pageSz = Number(pageSize);
    const offset = pageNum * pageSz;

    const employers = await Employer.findAndCountAll({
      where,
      order: [['createdOn', sortDirection]],
      limit: pageSz,
      offset,
    });

    return {
      employers: employers.rows,
      totalItems: employers.count,
      currentPage: pageNumber,
      totalPages: Math.ceil(employers.count / pageSz),
    };
  }

  async findById(id: number): Promise<any> {
    return await Employer.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'jobs',
          // include: [
          //   {
          //     model: JobPersonalities,
          //     as: 'jobPersonalities',
          //     attributes: ['position', 'personalities'],
          //     include: [
          //       {
          //         model: Personality,
          //         as: 'personalityDetails',
          //         attributes: ['personalityId', 'personality', 'active'],
          //       },
          //     ],
          //   },
          // ],
        },
        {
          model: EmployerMedia,
          as: 'media',
          attributes: ['mediaId', 'position', 'url', 'thumbnail', 'mediaType'],
        },
        {
          model: EmployerAward,
          as: 'awards',
        },
        {
          model: EmployerIndustry,
          as: 'employerIndustry',
          include: [
            {
              model: Industry,
              as: 'industry',
            },
          ],
        },
        {
          model: Location,
          as: 'location',
        },
      ],
    });
  }

  async updateEmployerDetails(
    employerId: string,
    updateEmployerDto: UpdateEmployerDto,
  ): Promise<Employer> {
    const employer = await Employer.findByPk(employerId);
    Object.assign(employer, updateEmployerDto);
    await employer.save();
    return employer;
  }

  async approveEmployer(
    employerId: number,
    approved: boolean,
  ): Promise<Employer> {
    const employer = await Employer.findByPk(employerId);
    employer.approved = approved;
    await employer.save();
    return employer;
  }

  calculateCompleteness(employer) {
    let profileCompleted = 0;
    let missingDetails = 0;

    if (employer.organizationName) {
      profileCompleted += profileWeightage.companyName;
    } else {
      missingDetails++;
    }

    if (employer.description) {
      profileCompleted += profileWeightage.about;
    } else {
      missingDetails++;
    }

    if (employer.employerIndustry?.length > 0) {
      profileCompleted += profileWeightage.industry;
    } else {
      missingDetails++;
    }

    if (employer.organizationWebsite) {
      profileCompleted += profileWeightage.webSite;
    } else {
      missingDetails++;
    }

    if (employer.organizationCulture) {
      profileCompleted += profileWeightage.culture;
    } else {
      missingDetails++;
    }

    if (employer.organizationBenefits) {
      profileCompleted += profileWeightage.benefits;
    } else {
      missingDetails++;
    }

    if (employer.organizationHeadline) {
      profileCompleted += profileWeightage.headline;
    } else {
      missingDetails++;
    }

    if (employer.awards?.length > 0) {
      profileCompleted += profileWeightage.awards;
    } else {
      missingDetails++;
    }

    if (employer.media.length > 0) {
      profileCompleted += profileWeightage.profilePhoto;
    } else {
      missingDetails++;
    }

    if (employer.organizationLocationId) {
      profileCompleted += profileWeightage.location;
    } else {
      missingDetails++;
    }

    employer.profileCompleted = profileCompleted;
    employer.missingDetails = missingDetails;
    return employer;
  }

  async findUserById(id: any): Promise<any> {
    return Employer.findByPk(id);
  }

  async uploadDocument(
    employerId: bigint,
    docType: string,
    employerDocumentDto: EmployerDocumentDto,
  ): Promise<EmployerDocument> {
    const document = new EmployerDocument({
      employerId,
      employerDocUrl: employerDocumentDto.employerDocUrl,
      documentName: employerDocumentDto.documentName,
      mediaType: employerDocumentDto.mediaType,
      uploadedOn: new Date(),
      docType: docType,
    });

    return await document.save();
  }

  async getDocumentsByEmployerId(
    employerId: bigint,
    query: any,
  ): Promise<EmployerDocument[]> {
    const { docType } = query;
    const whereConditions: any = { employerId };
    if (docType) {
      whereConditions.docType = docType;
    }
    return await EmployerDocument.findAll({
      where: whereConditions,
    });
  }

  async findDocById(id: any): Promise<any> {
    return EmployerDocument.findByPk(id);
  }
}
