import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { GenreEnum } from '../enums.genere';

@Injectable()
export class GenreValidationPipe implements PipeTransform {
  transform(value: any) {

    

    if (value && value.genre && !Object.values(GenreEnum).includes(value.genre)) {
        throw new BadRequestException(`Genre ${value.genre} is invalid`);
      }

    return value; 
  }
}
