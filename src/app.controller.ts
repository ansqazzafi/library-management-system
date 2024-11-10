import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {

    @Get()
    public sayHi():string{
        return "Hello Welcome to Library Management System"
    }
}
