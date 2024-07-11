import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDTO } from './dto/createUserDTO';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  create(@Body(ValidationPipe) createUserDTO: createUserDTO) {
    return this.usersService.create(createUserDTO);
  }
}
