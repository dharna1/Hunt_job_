import { Injectable } from '@nestjs/common';
import { Skill } from 'src/models/skills.entity';

@Injectable()
export class SkillsService {
  async getSkills(type?: string): Promise<Skill[]> {
    const query: any = {};

    if (type) {
      query.type = type;
    }

    return Skill.findAll({ where: query });
  }
}
