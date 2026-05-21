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


import { BaseEvent } from './base.event';
import { DistributionCreatedEvent } from './distributioncreated.event';
import { DistributionUpdatedEvent } from './distributionupdated.event';
import { DistributionDeletedEvent } from './distributiondeleted.event';
import { ReplenishmentPlannedEvent } from './replenishmentplanned.event';
import { TransferOrderCreatedEvent } from './transferordercreated.event';
import { TransferDispatchedEvent } from './transferdispatched.event';
import { TransferReceivedEvent } from './transferreceived.event';
import { InventoryThresholdBreachedEvent } from './inventorythresholdbreached.event';

export type RegisteredEventClass<T extends BaseEvent = BaseEvent> = new (
  aggregateId: string,
  payload: any
) => T;

export interface RegisteredEventDefinition<T extends BaseEvent = BaseEvent> {
  topic: string;
  eventName: string;
  version: string;
  eventClass: RegisteredEventClass<T>;
  retryTopic: string;
  dlqTopic: string;
  maxRetries: number;
  replayable: boolean;
}

const createEventDefinition = <T extends BaseEvent>(
  topic: string,
  eventClass: RegisteredEventClass<T>,
  overrides?: Partial<Omit<RegisteredEventDefinition<T>, 'topic' | 'eventName' | 'eventClass'>>,
): RegisteredEventDefinition<T> => ({
  topic,
  eventName: eventClass.name,
  version: overrides?.version ?? '1.0.0',
  eventClass,
  retryTopic: overrides?.retryTopic ?? topic + '-retry',
  dlqTopic: overrides?.dlqTopic ?? topic + '-dlq',
  maxRetries: overrides?.maxRetries ?? 3,
  replayable: overrides?.replayable ?? true,
});

const EVENT_DEFINITION_OVERRIDES: Partial<Record<string, Partial<Omit<RegisteredEventDefinition, 'topic' | 'eventName' | 'eventClass'>>>> = {
  'replenishment-planned': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'transfer-order-created': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'transfer-dispatched': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'transfer-received': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
};

export const EVENT_DEFINITIONS: Record<string, RegisteredEventDefinition> = {
  'distribution-created': createEventDefinition('distribution-created', DistributionCreatedEvent, EVENT_DEFINITION_OVERRIDES['distribution-created']),
  'distribution-updated': createEventDefinition('distribution-updated', DistributionUpdatedEvent, EVENT_DEFINITION_OVERRIDES['distribution-updated']),
  'distribution-deleted': createEventDefinition('distribution-deleted', DistributionDeletedEvent, EVENT_DEFINITION_OVERRIDES['distribution-deleted']),
  'replenishment-planned': createEventDefinition('replenishment-planned', ReplenishmentPlannedEvent, EVENT_DEFINITION_OVERRIDES['replenishment-planned']),
  'transfer-order-created': createEventDefinition('transfer-order-created', TransferOrderCreatedEvent, EVENT_DEFINITION_OVERRIDES['transfer-order-created']),
  'transfer-dispatched': createEventDefinition('transfer-dispatched', TransferDispatchedEvent, EVENT_DEFINITION_OVERRIDES['transfer-dispatched']),
  'transfer-received': createEventDefinition('transfer-received', TransferReceivedEvent, EVENT_DEFINITION_OVERRIDES['transfer-received']),
};

export const EXTERNAL_EVENT_DEFINITIONS: Record<string, RegisteredEventDefinition> = {
  'inventory-threshold-breached': createEventDefinition('inventory-threshold-breached', InventoryThresholdBreachedEvent, {
    version: '1.0.0',
    retryTopic: 'inventory-threshold-breached-retry',
    dlqTopic: 'inventory-threshold-breached-dlq',
    maxRetries: 5,
    replayable: true,
  }),
};

const ALL_EVENT_DEFINITIONS: Record<string, RegisteredEventDefinition> = {
  ...EVENT_DEFINITIONS,
  ...EXTERNAL_EVENT_DEFINITIONS,
};

export const EVENT_REGISTRY: Record<string, RegisteredEventClass> = Object.fromEntries(
  Object.values(ALL_EVENT_DEFINITIONS).map((definition) => [definition.topic, definition.eventClass])
);

export const EVENT_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.topic);
export const EVENT_RETRY_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.retryTopic);
export const EVENT_DLQ_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.dlqTopic);
export const EXTERNAL_EVENT_TOPICS = Object.values(EXTERNAL_EVENT_DEFINITIONS).map((definition) => definition.topic);
export const EXTERNAL_EVENT_RETRY_TOPICS = Object.values(EXTERNAL_EVENT_DEFINITIONS).map((definition) => definition.retryTopic);
export const EXTERNAL_EVENT_DLQ_TOPICS = Object.values(EXTERNAL_EVENT_DEFINITIONS).map((definition) => definition.dlqTopic);
export const EVENT_CONSUMER_TOPICS = Array.from(new Set([
  ...EVENT_TOPICS,
  ...EVENT_RETRY_TOPICS,
  ...EXTERNAL_EVENT_TOPICS,
  ...EXTERNAL_EVENT_RETRY_TOPICS,
]));
export const EVENT_ADMIN_TOPICS = Array.from(new Set([
  ...EVENT_TOPICS,
  ...EVENT_RETRY_TOPICS,
  ...EVENT_DLQ_TOPICS,
  ...EXTERNAL_EVENT_RETRY_TOPICS,
  ...EXTERNAL_EVENT_DLQ_TOPICS,
]));

export const resolveEventDefinition = (candidate?: string): RegisteredEventDefinition | undefined => {
  if (!candidate) {
    return undefined;
  }

  if (ALL_EVENT_DEFINITIONS[candidate]) {
    return ALL_EVENT_DEFINITIONS[candidate];
  }

  return Object.values(ALL_EVENT_DEFINITIONS).find(
    (definition) =>
      definition.topic === candidate ||
      definition.retryTopic === candidate ||
      definition.dlqTopic === candidate ||
      definition.eventName === candidate,
  );
};
