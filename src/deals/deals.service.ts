import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { PrismaService } from '../prisma/prisma.service';
//import { Prisma } from '@generated/prisma';

/*type DealWithRelations = Prisma.DealGetPayload<{
  include: { contact: true; user: true; lossReason: true };
}>;*/

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDealDto: CreateDealDto, userId: number) {
    //return 'This action adds a new deal';
    //const { contactId, lossReasonId, ...data } = createDealDto;

    return this.prisma.deal.create({
      //data: { ...createDealDto, userId },
      data: {
        title: createDealDto.title,
        value: createDealDto.value,
        stage: createDealDto.stage,
        contactId: createDealDto.contactId,
        userId,
        lossReasonId: createDealDto.lossReasonId,
        lossReasonNote: createDealDto.lossReasonNote,
      },
    });
  }

  findAll(userId: number) {
    //return `This action returns all deals`;
    return this.prisma.deal.findMany({
      where: {
        userId,
      },
      /*include: {
        contact: true,
        user: true,
        lossReason: true,
      },*/
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    //return `This action returns a #${id} deal`;
    const deal = await this.prisma.deal.findUnique({
      where: {
        id,
        userId,
      },
      /*include: {
        contact: true,
        user: true,
        lossReason: true,
      },*/
    });

    if (!deal) throw new NotFoundException(`Deal with ID ${id} not found`);
    return deal;
  }

  async update(id: number, updateDealDto: UpdateDealDto, userId: number) {
    //return `This action updates a #${id} deal`;
    //const existing = await this.prisma.deal.findUnique({ where: { id } });
    //if (!existing) throw new NotFoundException(`Deal with ID ${id} not found`);
    await this.findOne(id, userId);

    //const { lossReasonId, ...data } = updateDealDto;

    return this.prisma.deal.update({
      where: { id },
      data: updateDealDto,
    });
  }

  async remove(id: number, userId: number) {
    //return `This action removes a #${id} deal`;
    //const existing = await this.prisma.deal.findUnique({ where: { id } });
    //if (!existing) throw new NotFoundException(`Deal with ID ${id} not found`);
    await this.findOne(id, userId);

    await this.prisma.deal.delete({ where: { id } });
    return { message: `Deal with ID ${id} deleted successfully` };
  }
}
