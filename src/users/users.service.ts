import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { createUserDTO } from './dto/createUserDTO';
import { ResponseFormat } from 'src/utils/response.util';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async register(createUser: createUserDTO) {
    try {
      const existingUser = await this.databaseService.user.findUnique({
        where: {
          email: createUser.email,
        },
      });

      if (existingUser) {
        throw new BadRequestException('Users already exists');
      }

      const hashedPassword = await bcrypt.hash(createUser.password, 10);

      const user = await this.databaseService.user.create({
        data: {
          ...createUser,
          password: hashedPassword,
        },
      });

      return ResponseFormat(user, true, 201);
    } catch (err) {
      throw err instanceof BadRequestException
        ? err
        : new InternalServerErrorException('An unexpected error occur');
    }
  }

  // async login(@Body(ValidationPipe) loginUser: createUserDTO) {
  //   try {
  //     const isUserValid = await this.databaseService.user.findUnique({
  //       where: {
  //         email: loginUser.email,
  //       },
  //     });

  //     if (!isUserValid) {
  //       throw new BadRequestException('User not valid!!');
  //     }

  //     return response.status(200).json({
  //       isSuccess: true,
  //       message: 'User Login Successfully',
  //     });
  //   } catch (err) {
  //     if (err instanceof BadRequestException) {
  //       throw err;
  //     } else {
  //       throw new InternalServerErrorException(err);
  //     }
  //   }
  // }
}
