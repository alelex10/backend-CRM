import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DealStage } from '@generated/prisma';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats(userId: number) {
    const deals = await this.prisma.deal.findMany({
      where: { userId },
      include: { lossReason: true },
    });

    if (deals.length === 0) {
      return {
        totalSales: 0,
        winRate: 0,
        closeRate: 0,
        avgDaysToClose: 0,
        pipelineValue: 0,
        openDeals: 0,
        avgOpenDealAge: 0,
        avgDealSize: 0,
        salesPipeline: {},
        dealLossReasons: {},
      };
    }

    const now = new Date();
    const won = deals.filter((d) => d.stage === DealStage.Cerrado_Ganado);
    const lost = deals.filter((d) => d.stage === DealStage.Cerrado_Perdido);
    const closed = [...won, ...lost];
    const open = deals.filter(
      (d) =>
        d.stage !== DealStage.Cerrado_Ganado &&
        d.stage !== DealStage.Cerrado_Perdido,
    );

    // === Total Sales
    const totalSales = won.reduce((sum, d) => sum + (d.value || 0), 0);

    // === Win Rate
    const winRate = closed.length > 0 ? (won.length / closed.length) * 100 : 0;

    // === Close Rate
    const closeRate =
      deals.length > 0 ? (closed.length / deals.length) * 100 : 0;

    // === Avg Days to Close
    const avgDaysToClose =
      closed.length > 0
        ? closed.reduce((sum, d) => {
            if (!d.closedAt) return sum; // Si no tiene fecha de cierre, lo salteamos
            const diff =
              (d.closedAt.getTime() - d.createdAt.getTime()) /
              (1000 * 60 * 60 * 24);
            return sum + diff;
          }, 0) / closed.filter((d) => d.closedAt).length
        : 0;

    // === Pipeline Value
    const pipelineValue = open.reduce((sum, d) => sum + (d.value || 0), 0);

    // === Open Deals
    const openDeals = open.length;

    // === Avg Open Deal Age
    const avgOpenDealAge =
      openDeals > 0
        ? open.reduce((sum, d) => {
            const diff =
              (now.getTime() - d.createdAt.getTime()) / (1000 * 60 * 60 * 24);
            return sum + diff;
          }, 0) / openDeals
        : 0;

    // === Avg Deal Size
    const avgDealSize = won.length > 0 ? totalSales / won.length : 0;

    // === Sales Pipeline (agrupado por etapa)

    // Cantidad total de deals para el cálculo de porcentajes
    const totalDeals = deals.length;
    const totalLostDeals = lost.length;

    const salesPipeline = Object.values(DealStage).map((stage) => {
      const count = deals.filter((d) => d.stage === stage).length;
      const percentage = totalDeals > 0 ? (count / totalDeals) * 100 : 0;
      return {
        stage,
        percentage: Number(percentage.toFixed(2)), // Redondeamos a 2 decimales
      };
    });

    // === Deal Loss Reasons
    const lossReasons = await this.prisma.lossReason.findMany({
      include: { deals: true },
    });

    const dealLossReasons = lossReasons.map((reason) => {
      const count = reason.deals.filter(
        (d) => d.stage === DealStage.Cerrado_Perdido,
      ).length;
      const percentage =
        totalLostDeals > 0 ? (count / totalLostDeals) * 100 : 0;
      return {
        reason: reason.name,
        percentage: Number(percentage.toFixed(2)),
      };
    });

    return {
      totalSales,
      winRate,
      closeRate,
      avgDaysToClose,
      pipelineValue,
      openDeals,
      avgOpenDealAge,
      avgDealSize,
      salesPipeline,
      dealLossReasons,
    };
  }
}
