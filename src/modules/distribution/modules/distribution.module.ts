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


import { Module } from "@nestjs/common";
import { DistributionCommandController } from "../controllers/distributioncommand.controller";
import { DistributionQueryController } from "../controllers/distributionquery.controller";
import { DistributionCommandService } from "../services/distributioncommand.service";
import { DistributionQueryService } from "../services/distributionquery.service";

import { DistributionCommandRepository } from "../repositories/distributioncommand.repository";
import { DistributionQueryRepository } from "../repositories/distributionquery.repository";
import { DistributionRepository } from "../repositories/distribution.repository";
import { DistributionResolver } from "../graphql/distribution.resolver";
import { DistributionAuthGuard } from "../guards/distributionauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Distribution } from "../entities/distribution.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateDistributionHandler } from "../commands/handlers/createdistribution.handler";
import { UpdateDistributionHandler } from "../commands/handlers/updatedistribution.handler";
import { DeleteDistributionHandler } from "../commands/handlers/deletedistribution.handler";
import { GetDistributionByIdHandler } from "../queries/handlers/getdistributionbyid.handler";
import { GetDistributionByFieldHandler } from "../queries/handlers/getdistributionbyfield.handler";
import { GetAllDistributionHandler } from "../queries/handlers/getalldistribution.handler";
import { DistributionCrudSaga } from "../sagas/distribution-crud.saga";
import { DistributionInventoryThresholdBreachedSyncSaga } from "../sagas/distribution-inventory-threshold-breached-sync.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { DistributionInterceptor } from "../interceptors/distribution.interceptor";
import { DistributionLoggingInterceptor } from "../interceptors/distribution.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Distribution]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [DistributionCommandController, DistributionQueryController],
  providers: [
    //Services
    EventStoreService,
    DistributionQueryService,
    DistributionCommandService,
  
    //Repositories
    DistributionCommandRepository,
    DistributionQueryRepository,
    DistributionRepository,      
    //Resolvers
    DistributionResolver,
    //Guards
    DistributionAuthGuard,
    //Interceptors
    DistributionInterceptor,
    DistributionLoggingInterceptor,
    //CQRS Handlers
    CreateDistributionHandler,
    UpdateDistributionHandler,
    DeleteDistributionHandler,
    GetDistributionByIdHandler,
    GetDistributionByFieldHandler,
    GetAllDistributionHandler,
    DistributionCrudSaga,
    DistributionInventoryThresholdBreachedSyncSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    DistributionQueryService,
    DistributionCommandService,
  
    //Repositories
    DistributionCommandRepository,
    DistributionQueryRepository,
    DistributionRepository,      
    //Resolvers
    DistributionResolver,
    //Guards
    DistributionAuthGuard,
    //Interceptors
    DistributionInterceptor,
    DistributionLoggingInterceptor,
  ],
})
export class DistributionModule {}

