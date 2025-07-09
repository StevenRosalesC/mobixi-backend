import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';

export class CreateDeliveryDto {
  @ApiProperty({
    description: 'ID de la suscripción',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  subscriptionId: string;

  @ApiProperty({
    description: 'ID del producto',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  productId: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Estado de la entrega',
    enum: DeliveryStatus,
    example: DeliveryStatus.PENDING,
  })
  @IsEnum(DeliveryStatus)
  @IsOptional()
  status?: DeliveryStatus;

  @ApiProperty({
    description: 'Fecha programada para la entrega',
    example: '2024-02-15T10:30:00Z',
  })
  @IsDateString()
  scheduledDate: string;

  @ApiPropertyOptional({
    description: 'Fecha en que se realizó la entrega',
    example: '2024-02-15T14:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  deliveredDate?: string;

  @ApiPropertyOptional({
    description: 'Código de seguimiento de la entrega',
    example: 'TRK123456789',
  })
  @IsString()
  @IsOptional()
  trackingCode?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la entrega',
    example: 'Entregado en recepción del edificio',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDeliveryDto {
  @ApiPropertyOptional({
    description: 'Estado de la entrega',
    enum: DeliveryStatus,
    example: DeliveryStatus.DELIVERED,
  })
  @IsEnum(DeliveryStatus)
  @IsOptional()
  status?: DeliveryStatus;

  @ApiPropertyOptional({
    description: 'Fecha en que se realizó la entrega',
    example: '2024-02-15T14:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  deliveredDate?: string;

  @ApiPropertyOptional({
    description: 'Código de seguimiento de la entrega',
    example: 'TRK123456789',
  })
  @IsString()
  @IsOptional()
  trackingCode?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la entrega',
    example: 'Entregado en recepción del edificio',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

export class DeliveryQueryDto {
  @ApiPropertyOptional({
    description: 'ID de la suscripción para filtrar entregas',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  subscriptionId?: string;

  @ApiPropertyOptional({
    description: 'ID del producto para filtrar entregas',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({
    description: 'ID del usuario para filtrar entregas',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Estado de la entrega para filtrar',
    enum: DeliveryStatus,
    example: DeliveryStatus.PENDING,
  })
  @IsEnum(DeliveryStatus)
  @IsOptional()
  status?: DeliveryStatus;

  @ApiPropertyOptional({
    description: 'Número de página para paginación',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
