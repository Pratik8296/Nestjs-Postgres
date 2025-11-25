import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from 'src/database/database.service';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(private readonly databaseService: PrismaService) { }

  async create(createUserDto: Prisma.UserCreateInput) {

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword;

    const createUser = await this.databaseService.user.create({ data: createUserDto });
    return createUser;
  }

  async findAll(role?: 'USER' | 'ADMIN') {
    if (role) {
      return this.databaseService.user.findMany({ where: { role } });
    }
    return this.databaseService.user.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({ where: { id }, data: updateUserDto });
  }

  async remove(id: number) {
    return this.databaseService.user.delete({ where: { id } });
  }
}
