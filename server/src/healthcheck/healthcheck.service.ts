import { Injectable } from '@nestjs/common';
import { CreateHealthcheckDto } from './dto/create-healthcheck.dto';
import { UpdateHealthcheckDto } from './dto/update-healthcheck.dto';

@Injectable()
export class HealthcheckService {
  create(createHealthcheckDto: CreateHealthcheckDto) {
    return 'This action adds a new healthcheck';
  }

  findAll() {
    return `This action returns all healthcheck`;
  }

  findOne(id: number) {
    return `This action returns a #${id} healthcheck`;
  }

  update(id: number, updateHealthcheckDto: UpdateHealthcheckDto) {
    return `This action updates a #${id} healthcheck`;
  }

  remove(id: number) {
    return `This action removes a #${id} healthcheck`;
  }
}
