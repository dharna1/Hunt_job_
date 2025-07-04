import { IsNotEmpty } from "class-validator";

export class CreateCourseDto {
  

    @IsNotEmpty({ message: 'CourseName is required.' })
    courseName: string;
}