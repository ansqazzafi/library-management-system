import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any) {
    const page = parseInt(value.page, 10) || 1;
    const limit = parseInt(value.limit, 10) || 10;

    if (page <= 0) {
      throw new BadRequestException('Page number must be a positive integer');
    }

    if (limit <= 0) {
      throw new BadRequestException('Limit must be a positive integer');
    }

    return { page, limit };
  }
}
