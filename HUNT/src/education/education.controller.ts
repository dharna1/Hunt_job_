import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { EducationService } from "./education.service";
import { CreateCourseDto } from "./education-dto/education.dto";
import { AppError } from "src/utils/appError";
import { Response } from "express"; 

@Controller('education')
export class EducationController{
    constructor(private readonly educationService: EducationService ){}

    @Post()
    async createEducation(
        @Body() createCourseDto: CreateCourseDto,
        @Res() res: Response,
    ){
       try{
           const createCourse = await this.educationService.createEducation(
            createCourseDto
           );
           return res.status(201).json(createCourse);
       } 
        catch (error) {
        console.error('employeeRating -> error:', error);
        if (error instanceof AppError) {
          return res.status(error.getStatusCode()).json(error);
        } else {
          return res
            .status(500)
            .json(
              new AppError(500).addServerError('Unable to process your request'),
            );
        }
      }
    }

    @Get()
    async getEducation(
        @Res() res: Response
    ){
        try {
            const courses = await this.educationService.getEducation();
            return res.status(200).json(courses);
          } catch (error) {
            console.error('getAllCourses -> error:', error);
            return res
              .status(500)
              .json(
                new AppError(500).addServerError('Unable to retrieve the courses'),
              );
          }
        }
}