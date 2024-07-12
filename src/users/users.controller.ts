import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDTO } from './dto/createUserDTO';
import { HandleService } from 'src/utils/response.util';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @UsePipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const message = errors
          .map((err) => Object.values(err.constraints))
          .join(',');

        return new BadRequestException({ message, isSuccess: false });
      },
    }),
  )
  async register(@Body() createUser: createUserDTO, @Res() res: Response) {
    try {
      const result = await this.usersService.register(createUser);
      return res.json(result);
    } catch (err) {
      const errorResponse = HandleService(err);
      return res.status(errorResponse.statusCode).json(errorResponse);
    }
  }

  // @Post()
  // login(@Body(ValidationPipe) loginUserDTO: createUserDTO) {
  //   return this.usersService.login(loginUserDTO);
  // }
}
