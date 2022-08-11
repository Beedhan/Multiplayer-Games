import { Module } from '@nestjs/common';
import { TyperaceService } from './typerace.service';
import { TyperaceGateway } from './typerace.gateway';

@Module({
  providers: [TyperaceGateway, TyperaceService]
})
export class TyperaceModule {}
