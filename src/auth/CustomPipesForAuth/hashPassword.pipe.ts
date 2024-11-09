import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
  async transform(value: any) {
    if (value.password) {
      try {
        const hashedPassword = await bcrypt.hash(value.password, 10);
        value.password = hashedPassword; 
      } catch (error) {
        throw new BadRequestException('Error hashing password');
      }
    } else {
      throw new BadRequestException('Password is required');
    }
    return value;
  }
}
