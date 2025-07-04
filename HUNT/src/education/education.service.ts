import { Injectable } from "@nestjs/common";
import { CreateCourseDto } from "./education-dto/education.dto";
import { CourseType } from "src/models/courseType.entity";


@Injectable()
export class EducationService {
    constructor() {}
    async createEducation(createCourseDto: CreateCourseDto): Promise<any> {
        const { courseName} = createCourseDto;
        const lastCourse = await CourseType.findOne({ order: [['courseId', 'DESC']] });

        const nextCourseId = lastCourse ? BigInt(lastCourse.courseId) + BigInt(1) : BigInt(1);
        const createCourse = new CourseType({
            courseId: nextCourseId,
            courseName,
          });
          await createCourse.save();
          return {
            ...createCourse.toJSON(),
            courseId: createCourse.courseId.toString(),  // Convert BigInt to string
          };     
    }

    async getEducation(): Promise<any>{
        return await CourseType.findAll();
    }
  }