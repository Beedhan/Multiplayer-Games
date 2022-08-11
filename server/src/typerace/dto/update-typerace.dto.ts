import { PartialType } from '@nestjs/mapped-types';
import { CreateTyperaceDto } from './create-typerace.dto';

export class UpdateTyperaceDto extends PartialType(CreateTyperaceDto) {
  id: number;
}
