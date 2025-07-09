import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionStatus, DeliveryFrequency } from '@prisma/client';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'ID de la tienda',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  storeId: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID del producto',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  productId: string;

  @ApiPropertyOptional({
    description: 'Estado de la suscripción',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Fecha de inicio de la suscripción',
    example: '2024-01-15T10:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin de la suscripción',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de la próxima entrega',
    example: '2024-02-15T10:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  nextDeliveryDate?: string;

  @ApiPropertyOptional({
    description: 'Frecuencia de entrega',
    enum: DeliveryFrequency,
    example: DeliveryFrequency.MONTHLY,
  })
  @IsEnum(DeliveryFrequency)
  @IsOptional()
  deliveryFrequency?: DeliveryFrequency;

  @ApiPropertyOptional({
    description: 'Número total de entregas programadas',
    example: 12,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  totalDeliveries?: number;

  @ApiPropertyOptional({
    description: 'Número de entregas realizadas',
    example: 0,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  deliveredCount?: number;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la suscripción',
    example: 'Suscripción premium con entrega mensual',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({
    description: 'Estado de la suscripción',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.PAUSED,
  })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Fecha de fin de la suscripción',
    example: '2024-12-31T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Fecha de la próxima entrega',
    example: '2024-03-15T10:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  nextDeliveryDate?: string;

  @ApiPropertyOptional({
    description: 'Frecuencia de entrega',
    enum: DeliveryFrequency,
    example: DeliveryFrequency.BIWEEKLY,
  })
  @IsEnum(DeliveryFrequency)
  @IsOptional()
  deliveryFrequency?: DeliveryFrequency;

  @ApiPropertyOptional({
    description: 'Número total de entregas programadas',
    example: 24,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  totalDeliveries?: number;

  @ApiPropertyOptional({
    description: 'Número de entregas realizadas',
    example: 5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  deliveredCount?: number;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la suscripción',
    example: 'Suscripción actualizada con entrega quincenal',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class SubscriptionQueryDto {
  @ApiPropertyOptional({
    description: 'ID de la tienda para filtrar suscripciones',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  storeId?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario para filtrar suscripciones',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'ID del producto para filtrar suscripciones',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Estado de la suscripción para filtrar',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @ApiPropertyOptional({
    description: 'Frecuencia de entrega para filtrar',
    enum: DeliveryFrequency,
    example: DeliveryFrequency.MONTHLY,
  })
  @IsEnum(DeliveryFrequency)
  @IsOptional()
  deliveryFrequency?: DeliveryFrequency;

  @ApiPropertyOptional({
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
