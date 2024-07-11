import {
  BadRequestException,
  Body,
  Injectable,
  InternalServerErrorException,
  ValidationPipe,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { createUserDTO } from './dto/createUserDTO';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll() {
    return await this.databaseService.user.findMany();
  }

  async create(@Body(ValidationPipe) createUser: createUserDTO) {
    try {
      const existingUsers = await this.databaseService.user.findUnique({
        where: {
          email: createUser.email,
        },
      });

      if (existingUsers) {
        throw new BadRequestException('User already exists');
      }

      return await this.databaseService.user.create({
        data: createUser,
      });
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      } else {
        throw new InternalServerErrorException(err);
      }
    }
  }
}
