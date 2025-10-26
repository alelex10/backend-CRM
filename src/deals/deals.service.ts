import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { PrismaService } from '../prisma/prisma.service';
import { DealStage } from '@generated/prisma';

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDealDto: CreateDealDto, userId: number) {
    //return 'This action adds a new deal';

    return this.prisma.deal.create({
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
      include: {
        lossReason: true,
      },
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
      include: {
        lossReason: true,
      },
    });

    if (!deal) throw new NotFoundException(`Deal with ID ${id} not found`);
    return deal;
  }

  async update(id: number, updateDealDto: UpdateDealDto, userId: number) {
    //return `This action updates a #${id} deal`;
    await this.findOne(id, userId);

    // Determina la fecha de cierre si la etapa indica que se cerró el deal
    const isClosedStage =
      updateDealDto.stage === DealStage.Cerrado_Ganado ||
      updateDealDto.stage === DealStage.Cerrado_Perdido;

    const closedAt = isClosedStage ? new Date() : null;

    const lossReasonId =
      updateDealDto.stage === DealStage.Cerrado_Perdido
        ? (updateDealDto.lossReasonId ?? 6) // default a 6 si no viene
        : null; // Cerrado_Ganado o cualquier otra etapa se resetea

    return this.prisma.deal.update({
      where: { id },
      data: {
        ...updateDealDto,
        closedAt,
        lossReasonId,
      },
      include: {
        lossReason: true,
      },
    });
  }

  async remove(id: number, userId: number) {
    //return `This action removes a #${id} deal`;
    await this.findOne(id, userId);

    await this.prisma.deal.delete({ where: { id } });
    return { message: `Deal with ID ${id} deleted successfully` };
  }
}
