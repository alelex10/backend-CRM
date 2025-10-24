import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { Role, User } from '../../generated/prisma';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // simulate database
  // private readonly users: () => Promise<User[]> = async () => [
  //   {
  //     username: 'john',
  //     password: await bcrypt.hash('123123', 10),
  //     roles: [Role.USER],
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     contacts: [],
  //     companies: [],
  //     email: 'john@example',
  //     id: 1,
  //   },
  //   {
  //     username: 'jane',
  //     password: await bcrypt.hash('123123', 10),
  //     roles: [Role.USER],
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //     contacts: [],
  //     companies: [],
  //     email: 'jane@example',
  //     id: 2,
  //   },
  // ];
  getProfile(id: number) {
    return this.findById(id);
  }
  async getAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.roles) {
      createUserDto.roles = [Role.USER];
    }
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  findAll() {
    return `This action returns all user`;
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
