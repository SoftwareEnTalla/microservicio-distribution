import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';
import { CreateDistributionCommand } from '../commands/exporting.command';
import { InventoryThresholdBreachedEvent } from '../events/inventorythresholdbreached.event';
import { SagaDistributionFailedEvent } from '../events/distribution-failed.event';

@Injectable()
export class DistributionInventoryThresholdBreachedSyncSaga {
  private readonly logger = new Logger(DistributionInventoryThresholdBreachedSyncSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  @Saga()
  onInventoryThresholdBreached = ($events: Observable<InventoryThresholdBreachedEvent>) => {
    return $events.pipe(
      ofType(InventoryThresholdBreachedEvent),
      tap(event => {
        this.logger.log(`Saga distribution-inventory-threshold-breached-sync recibió InventoryThresholdBreached: ${event.aggregateId}`);
        void this.handleInventoryThresholdBreached(event);
      }),
      map(() => null)
    );
  };

  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance().registerClient(DistributionInventoryThresholdBreachedSyncSaga.name).get(DistributionInventoryThresholdBreachedSyncSaga.name),
  })
  private async handleInventoryThresholdBreached(event: InventoryThresholdBreachedEvent): Promise<void> {
    try {
      const payload = event?.payload?.instance ?? {};
      const metadata = payload?.metadata ?? {};
      const targetWarehouseId = String(payload?.warehouseId ?? '').trim();
      const sourceWarehouseId = String(metadata?.replenishmentSourceWarehouseId ?? metadata?.sourceWarehouseId ?? '').trim();
      const skuId = String(payload?.skuId ?? metadata?.skuId ?? '').trim();
      const reorderPoint = Number(payload?.reorderPoint ?? metadata?.reorderPoint ?? 0);
      const availableQty = Number(payload?.availableQty ?? 0);
      const quantity = Number(metadata?.replenishmentQty ?? Math.max(reorderPoint - availableQty, 1));

      if (!targetWarehouseId || !sourceWarehouseId || !skuId || sourceWarehouseId === targetWarehouseId || !Number.isFinite(quantity) || quantity <= 0) {
        return;
      }

      const correlationId = String(event?.payload?.metadata?.correlationId ?? event?.aggregateId);
      const transferOrderCode = 'AUTO-REPL-' + String(event.aggregateId).slice(0, 8) + '-' + Date.now();

      await this.commandBus.execute(
        new CreateDistributionCommand(
          {
            name: 'Auto replenishment ' + String(payload?.code ?? event.aggregateId).slice(0, 24),
            isActive: true,
            transferOrderCode,
            sourceWarehouseId,
            targetWarehouseId,
            status: 'PLANNED',
            priority: 'HIGH',
            requiredAt: new Date(),
            transferMode: 'INTERNAL',
            metadata: {
              scenario: metadata?.scenario ?? 'inventory-threshold-breached-sync',
              skuId,
              quantity,
              triggerInventoryId: payload?.id ?? event.aggregateId,
              triggerInventoryCode: payload?.code ?? null,
              triggerAvailableQty: availableQty,
              triggerReorderPoint: reorderPoint,
              autoReplenishment: true,
              correlationId,
            },
          },
          {
            instance: payload,
            metadata: {
              ...event?.payload?.metadata,
              correlationId,
              causationId: event?.payload?.metadata?.eventId ?? correlationId,
              saga: 'distribution-inventory-threshold-breached-sync',
            },
          },
        ),
      );
    } catch (error: any) {
      this.logger.error(`Error en distribution-inventory-threshold-breached-sync: ${error.message}`);
      this.eventBus.publish(new SagaDistributionFailedEvent(error, event));
    }
  }
}