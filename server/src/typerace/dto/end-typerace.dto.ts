import { PartialType } from '@nestjs/mapped-types';
import { CreateTyperaceDto } from './create-typerace.dto';

export class EndTyperaceDto extends PartialType(CreateTyperaceDto) {
  stats: { wpm: number; accuracy: number };
}
