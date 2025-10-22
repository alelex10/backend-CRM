import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

    if (isUnique) {
      throw new BadRequestException('Company already exists');
    }

    return this.prisma.company.create({
      data: createCompanyDto,
    });
  }

  // verificamos si el name de la company ya existe
  // si existe devolvemos true
  async isUniqueName(name: string): Promise<boolean> {
    const company = await this.prisma.company.findFirst({
      where: {
        name,
      },
    });

    return !!company;
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

  async findOne(id: number): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
      },
      include: {
        contacts: {
          where: { deletedAt: null },
        },
      },
    });

    if (!company)
      throw new BadRequestException(`Company not found With id: ${id}`);

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    // editar company
    try {
      const company = await this.prisma.company.update({
        where: {
          id,
        },
        data: updateCompanyDto,
      });
      return company;
    } catch (error) {
      throw new BadRequestException(`Company not found With id: ${id}`);
    }
  }

  async remove(id: number): Promise<Company> {
    // eliminar company
    try {
      const company = await this.prisma.company.delete({
        where: {
          id,
        },
      });
      return company;
    } catch (error) {
      throw new NotFoundException(`Company not found With id: ${id}`);
    }
  }
}
