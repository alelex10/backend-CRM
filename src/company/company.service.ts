import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Company } from '../../generated/prisma';
import { IPaginatedResponse } from '../common/interface/paginated-response.interface';
import { ResponsePaginatedDto } from '../common/abstract/response-paginated.dto';
import { Find } from '../common/abstract/find';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const isUnique = await this.isUniqueName(createCompanyDto.name);
    if (!isUnique) {
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

  // traemos todas las company paginados
  async findAll(query: Find): Promise<IPaginatedResponse<Company>> {
    const { page = 1, limit = 10, search, order } = query;

    const companies = await this.prisma.company.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: {
          contains: search,
        },
      },
      orderBy: {
        name: order,
      },
    });

    return new ResponsePaginatedDto(companies, page, limit);
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
