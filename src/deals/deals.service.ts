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
        deletedAt: null,
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
        deletedAt: null,
      },
      include: {
        lossReason: true,
      },
    });

    if (!deal) throw new NotFoundException(`Deal with ID ${id} not found`);
    return deal;
  }

  async update(id: number, updateDealDto: UpdateDealDto, userId: number) {
    const existingDeal = await this.findOne(id, userId);

    // Determinar stage final (puede venir del DTO o mantenerse igual)
    const finalStage = updateDealDto.stage ?? existingDeal.stage;

    // Determinar si está cerrado o no
    const isClosedStage =
      finalStage === DealStage.Cerrado_Ganado ||
      finalStage === DealStage.Cerrado_Perdido;

    // Si se cierra ahora (pasó de abierto a cerrado), ponemos fecha de cierre
    // Si ya estaba cerrado, mantenemos su fecha anterior
    // Si se reabre, lo dejamos en null
    const closedAt =
      isClosedStage && !existingDeal.closedAt
        ? new Date()
        : isClosedStage
          ? existingDeal.closedAt
          : null;

    // Determinar motivo de pérdida
    // Si sigue siendo Cerrado_Perdido, permitimos modificarlo
    // Si cambia de estado a otro, se limpia
    let lossReasonId = existingDeal.lossReasonId;
    if (finalStage === DealStage.Cerrado_Perdido) {
      lossReasonId =
        updateDealDto.lossReasonId ?? existingDeal.lossReasonId ?? 6;
    } else {
      lossReasonId = null;
    }

    return this.prisma.deal.update({
      where: { id },
      data: {
        ...updateDealDto,
        stage: finalStage,
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

    //await this.prisma.deal.delete({ where: { id } });
    await this.prisma.deal.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: `Deal with ID ${id} deleted successfully` };
  }
}
