import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { createUserDTO } from './dto/createUserDTO';
import { ResponseFormat } from 'src/utils/response.util';
import * as bcrypt from 'bcrypt';
import { loginUserDTO } from './dto/loginUserDTO';

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

      const { id, name, email } = user;

      return ResponseFormat(
        { id, name, email },
        true,
        201,
        'User Registration Successfully',
      );
    } catch (err) {
      throw err instanceof BadRequestException
        ? err
        : new InternalServerErrorException('An unexpected error occur');
    }
  }

  async login(userLogin: loginUserDTO) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: {
          email: userLogin.email,
        },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(userLogin.password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const { id, name, email } = user;

      return ResponseFormat(
        { id, name, email },
        true,
        200,
        'User Login Successfully',
      );
    } catch (err) {
      throw err instanceof UnauthorizedException
        ? err
        : new InternalServerErrorException('An expected error occured');
    }
  }
}
