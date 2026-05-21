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

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseDistributionDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateDistribution',
    example: 'Nombre de instancia CreateDistribution',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateDistributionDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateDistribution).',
    example: 'Fecha de creación de la instancia (CreateDistribution).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateDistribution).',
    example: 'Fecha de actualización de la instancia (CreateDistribution).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateDistribution).',
    example:
      'Usuario que realiza la creación de la instancia (CreateDistribution).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateDistribution).',
    example: 'Estado de activación de la instancia (CreateDistribution).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de la transferencia',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de la transferencia', nullable: false })
  transferOrderCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Almacén origen',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Almacén origen', nullable: false })
  sourceWarehouseId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Almacén destino',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Almacén destino', nullable: false })
  targetWarehouseId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la transferencia',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la transferencia', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Prioridad operativa',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Prioridad operativa', nullable: true })
  priority?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha requerida',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha requerida', nullable: false })
  requiredAt!: Date;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Modo de traslado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Modo de traslado', nullable: true })
  transferMode?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del plan o transferencia',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos del plan o transferencia', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseDistributionDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class DistributionDto extends BaseDistributionDto {
  // Propiedades específicas de la clase DistributionDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<DistributionDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<DistributionDto>): DistributionDto {
    const instance = new DistributionDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class DistributionValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => DistributionDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => DistributionDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class DistributionOutPutDto extends BaseDistributionDto {
  // Propiedades específicas de la clase DistributionOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<DistributionOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<DistributionOutPutDto>): DistributionOutPutDto {
    const instance = new DistributionOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateDistributionDto extends BaseDistributionDto {
  // Propiedades específicas de la clase CreateDistributionDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateDistribution a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateDistributionDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateDistributionDto>): CreateDistributionDto {
    const instance = new CreateDistributionDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateDistributionDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateDistributionDto,
    description: 'Instancia CreateDistribution o UpdateDistribution',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateDistributionDto, { nullable: true })
  input?: CreateDistributionDto | UpdateDistributionDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteDistributionDto {
  // Propiedades específicas de la clase DeleteDistributionDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteDistribution a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteDistribution a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateDistributionDto extends BaseDistributionDto {
  // Propiedades específicas de la clase UpdateDistributionDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateDistribution a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateDistributionDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateDistributionDto>): UpdateDistributionDto {
    const instance = new UpdateDistributionDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



