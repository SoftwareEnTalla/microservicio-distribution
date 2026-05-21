/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 */

import { Distribution } from '../entities/distribution.entity';
import { BaseEvent, PayloadEvent } from './base.event';
import { v4 as uuidv4 } from 'uuid';

export class InventoryThresholdBreachedEvent extends BaseEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly payload: PayloadEvent<any | Distribution>
  ) {
    super(aggregateId);
  }

  static create(
    instanceId: string,
    instance: any | Distribution,
    userId: string,
    correlationId?: string
  ): InventoryThresholdBreachedEvent {
    return new InventoryThresholdBreachedEvent(instanceId, {
      instance,
      metadata: {
        initiatedBy: userId,
        correlationId: correlationId || uuidv4(),
      },
    });
  }
}