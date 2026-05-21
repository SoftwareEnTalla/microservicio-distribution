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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { Distribution } from "../entities/distribution.entity";

//Definición de comandos
import {
  CreateDistributionCommand,
  UpdateDistributionCommand,
  DeleteDistributionCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { DistributionQueryService } from "../services/distributionquery.service";


import { DistributionResponse, DistributionsResponse } from "../types/distribution.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateDistributionDto, 
CreateOrUpdateDistributionDto, 
DistributionValueInput, 
DistributionDto, 
CreateDistributionDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Distribution)
export class DistributionResolver {

   //Constructor del resolver de Distribution
  constructor(
    private readonly service: DistributionQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  // Mutaciones
  @Mutation(() => DistributionResponse<Distribution>)
  async createDistribution(
    @Args("input", { type: () => CreateDistributionDto }) input: CreateDistributionDto
  ): Promise<DistributionResponse<Distribution>> {
    return this.commandBus.execute(new CreateDistributionCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Mutation(() => DistributionResponse<Distribution>)
  async updateDistribution(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateDistributionDto
  ): Promise<DistributionResponse<Distribution>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateDistributionCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Mutation(() => DistributionResponse<Distribution>)
  async createOrUpdateDistribution(
    @Args("data", { type: () => CreateOrUpdateDistributionDto })
    data: CreateOrUpdateDistributionDto
  ): Promise<DistributionResponse<Distribution>> {
    if (data.id) {
      const existingDistribution = await this.service.findById(data.id);
      if (existingDistribution) {
        return this.commandBus.execute(
          new UpdateDistributionCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateDistributionDto | UpdateDistributionDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateDistributionCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateDistributionDto | UpdateDistributionDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteDistribution(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteDistributionCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  // Queries
  @Query(() => DistributionsResponse<Distribution>)
  async distributions(
    options?: FindManyOptions<Distribution>,
    paginationArgs?: PaginationArgs
  ): Promise<DistributionsResponse<Distribution>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Query(() => DistributionsResponse<Distribution>)
  async distribution(
    @Args("id", { type: () => String }) id: string
  ): Promise<DistributionResponse<Distribution>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Query(() => DistributionsResponse<Distribution>)
  async distributionsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => DistributionValueInput }) value: DistributionValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<DistributionsResponse<Distribution>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Query(() => DistributionsResponse<Distribution>)
  async distributionsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<DistributionsResponse<Distribution>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Query(() => Number)
  async totalDistributions(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Query(() => DistributionsResponse<Distribution>)
  async searchDistributions(
    @Args("where", { type: () => DistributionDto, nullable: false })
    where: Record<string, any>
  ): Promise<DistributionsResponse<Distribution>> {
    const distributions = await this.service.findAndCount(where);
    return distributions;
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Query(() => DistributionResponse<Distribution>, { nullable: true })
  async findOneDistribution(
    @Args("where", { type: () => DistributionDto, nullable: false })
    where: Record<string, any>
  ): Promise<DistributionResponse<Distribution>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(DistributionResolver.name)

      .get(DistributionResolver.name),
    })
  @Query(() => DistributionResponse<Distribution>)
  async findOneDistributionOrFail(
    @Args("where", { type: () => DistributionDto, nullable: false })
    where: Record<string, any>
  ): Promise<DistributionResponse<Distribution> | Error> {
    return this.service.findOneOrFail(where);
  }
}

