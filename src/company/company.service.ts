import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Company, Contact } from '../../generated/prisma';
import { IPaginatedResponse } from '../common/interface/paginated-response.interface';
import { ResponsePaginatedDto } from '../common/abstract/response-paginated.dto';
import { Find } from '../common/abstract/find';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    id: number,
  ): Promise<Company> {
    const isUnique = await this.isUniqueName(createCompanyDto.name, id);

    if (isUnique) {
      throw new BadRequestException(
        `Company already exists with name: ${createCompanyDto.name}, id: ${isUnique.id}`,
      );
    }

    return this.prisma.company.create({
      data: { ...createCompanyDto, userId: id },
    });
  }

  // verificamos si el name de la company ya existe
  // si existe devolvemos true
  async isUniqueName(name: string, userId: number): Promise<Company | null> {
    const company = await this.prisma.company.findFirst({
      where: {
        name,
        userId,
        deletedAt: null,
      },
    });

    return company;
  }

  // traemos todas las company paginados
  async findAll(
    query: Find,
    userId: number,
  ): Promise<IPaginatedResponse<Company>> {
    const { page = 1, limit = 10, search, order, orderBy = 'name' } = query;

    // 1. Obtener el número total de registros
    const totalCompanies = await this.prisma.company.count({
      where: {
        name: {
          contains: search,
        },
        userId,
      },
    });

    // 2. Calcular el número total de páginas
    const totalPages = Math.ceil(totalCompanies / limit);

    const companies = await this.prisma.company.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        AND: {
          OR: [
            {
              name: {
                startsWith: search,
                mode: 'insensitive',
              },
            },
            {
              industry: {
                startsWith: search,
                mode: 'insensitive',
              },
            },
          ],
          userId,
        },
      },
      orderBy: {
        [orderBy]: order,
      },
    });

    return new ResponsePaginatedDto(companies, page, limit, totalPages);
  }

  async findOne(id: number, userId: number): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!company)
      throw new BadRequestException(`Company not found With id: ${id}`);

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
    userId: number,
  ): Promise<Company> {
    // editar company
    try {
      const company = await this.prisma.company.update({
        where: {
          id,
          userId,
          deletedAt: null,
        },
        data: updateCompanyDto,
      });
      return company;
    } catch (error) {
      throw new BadRequestException(`Company not found With id: ${id}`);
    }
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const company = await this.prisma.company.findFirst({
      where: { id, userId, deletedAt: null },
    });

    if (!company) {
      throw new NotFoundException(`Company not found with id: ${id}`);
    }

    // Desasociar los contactos relacionados
    await this.prisma.contact.updateMany({
      where: {
        companyId: id,
        userId,
      },
      data: { companyId: null },
    });

    // Marcar la empresa como eliminada (soft delete)
    await this.prisma.company.update({
      where: {
        id,
        userId,
      },
      data: { deletedAt: new Date() },
    });

    return { message: `Company with ID ${id} soft deleted successfully` };
  }

  async removeMany(
    ids: number[],
    userId: number,
  ): Promise<{ message: string }> {
    const listIds = ids.map((id) => Number(+id));
    const companies = await this.prisma.company.findMany({
      where: {
        id: {
          in: listIds,
        },
        userId,
        deletedAt: null,
      },
    });
    console.log("type company", typeof companies)
    console.log('companies', companies);

    if (companies.length === 0) {
      throw new NotFoundException(
        `Company·not·found·with·ids:·${ids.join(',')}`,
      );
    }

    await this.prisma.contact.updateMany({
      where: {
        companyId: {
          in: listIds,
        },
        userId: userId,
      },
      data: {
        companyId: null,
      },
    });

    await this.prisma.company.updateMany({
      where: {
        id: {
          in: listIds,
        },
        userId: userId,
      },
      data: { deletedAt: new Date() },
    });

    return { message: `Company deleted successfully with ids: ` + ids };
  }

  async getContactsOfCompany(id: number, userId: number): Promise<Contact[]> {
    const company = await this.prisma.company.findUnique({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company not found with id: ${id}`);
    }

    const contacts = await this.prisma.contact.findMany({
      where: {
        companyId: id,
        userId,
      },
    });

    console.log('contacts', contacts);

    return contacts;
  }
}
