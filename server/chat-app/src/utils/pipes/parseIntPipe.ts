import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const parsedValue = parseInt(value, 10);

    if (isNaN(parsedValue)) {
      throw new BadRequestException('Invalid userId. It should be a number.');
    }

    return parsedValue;
  }
}
