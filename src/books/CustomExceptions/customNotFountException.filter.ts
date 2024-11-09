import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomNotFoundException extends HttpException {
  constructor(message: string = "Resource not found") {
    super(message, HttpStatus.NOT_FOUND);
  }
}
