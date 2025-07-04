import { Injectable } from '@nestjs/common';
import { ReportReason } from 'src/enums/reportReason.enum';

@Injectable()
export class ReasonsService {
  async getEnumValues(): Promise<string[]> {
    console.log(Object.values(ReportReason), 'Object.values(ReportReason)');
    return Object.values(ReportReason);
  }
}
