/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  DistributionCreatedEvent,
  DistributionUpdatedEvent,
  DistributionDeletedEvent,
  ReplenishmentPlannedEvent,
  TransferOrderCreatedEvent,
  TransferDispatchedEvent,
  TransferReceivedEvent,
} from '../events/exporting.event';
import {
  SagaDistributionFailedEvent
} from '../events/distribution-failed.event';
import {
  CreateDistributionCommand,
  UpdateDistributionCommand,
  DeleteDistributionCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class DistributionCrudSaga {
  private readonly logger = new Logger(DistributionCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onDistributionCreated = ($events: Observable<DistributionCreatedEvent>) => {
    return $events.pipe(
      ofType(DistributionCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Distribution: ${event.aggregateId}`);
        void this.handleDistributionCreated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onDistributionUpdated = ($events: Observable<DistributionUpdatedEvent>) => {
    return $events.pipe(
      ofType(DistributionUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Distribution: ${event.aggregateId}`);
        void this.handleDistributionUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onDistributionDeleted = ($events: Observable<DistributionDeletedEvent>) => {
    return $events.pipe(
      ofType(DistributionDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Distribution: ${event.aggregateId}`);
        void this.handleDistributionDeleted(event);
      }),
      map(() => null)
    );
  };

  @Saga()
  onReplenishmentPlanned = ($events: Observable<ReplenishmentPlannedEvent>) => {
    return $events.pipe(
      ofType(ReplenishmentPlannedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio ReplenishmentPlanned: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onTransferOrderCreated = ($events: Observable<TransferOrderCreatedEvent>) => {
    return $events.pipe(
      ofType(TransferOrderCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio TransferOrderCreated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onTransferDispatched = ($events: Observable<TransferDispatchedEvent>) => {
    return $events.pipe(
      ofType(TransferDispatchedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio TransferDispatched: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onTransferReceived = ($events: Observable<TransferReceivedEvent>) => {
    return $events.pipe(
      ofType(TransferReceivedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio TransferReceived: ${event.aggregateId}`);
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
    client: LoggerClient.getInstance()
      .registerClient(DistributionCrudSaga.name)
      .get(DistributionCrudSaga.name),
  })
  private async handleDistributionCreated(event: DistributionCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Distribution Created completada: ${event.aggregateId}`);
      // Lógica post-creación (ej: enviar notificación, ejecutar comandos adicionales)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

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
    client: LoggerClient.getInstance()
      .registerClient(DistributionCrudSaga.name)
      .get(DistributionCrudSaga.name),
  })
  private async handleDistributionUpdated(event: DistributionUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Distribution Updated completada: ${event.aggregateId}`);
      // Lógica post-actualización (ej: actualizar caché)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

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
    client: LoggerClient.getInstance()
      .registerClient(DistributionCrudSaga.name)
      .get(DistributionCrudSaga.name),
  })
  private async handleDistributionDeleted(event: DistributionDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga Distribution Deleted completada: ${event.aggregateId}`);
      // Lógica post-eliminación (ej: limpiar relaciones)
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaDistributionFailedEvent( error,event));
  }
}
