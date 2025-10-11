import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Company } from '../../generated/prisma';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    if (await this.isUniqueName(createCompanyDto.name)) {
      throw new BadRequestException('Company already exists');
    }
    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  async isUniqueName(name: string): Promise<boolean> {
    const isUnique = await this.prisma.company.findFirst({
      where: {
        name,
      },
    });
    return !isUnique;
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
