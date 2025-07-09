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
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'ID de la suscripción (opcional)',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  subscriptionId?: string;

  @ApiProperty({
    description: 'Monto del pago',
    example: 49.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @ApiPropertyOptional({
    description: 'Método de pago',
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Estado del pago',
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Referencia del pago',
    example: 'PAY-2024-001',
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre el pago',
    example: 'Pago mensual de suscripción premium',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Fecha en que se realizó el pago',
    example: '2024-02-15T14:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  paidAt?: string;
}

export class UpdatePaymentDto {
  @ApiPropertyOptional({
    description: 'Método de pago',
    enum: PaymentMethod,
    example: PaymentMethod.TRANSFER,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Estado del pago',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Referencia del pago',
    example: 'PAY-2024-001-UPDATED',
  })
  @IsString()
  @IsOptional()
  reference?: string;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre el pago',
    example: 'Pago confirmado por transferencia bancaria',
  })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Fecha en que se realizó el pago',
    example: '2024-02-15T14:30:00Z',
  })
  @IsDateString()
  @IsOptional()
  paidAt?: string;
}

export class PaymentQueryDto {
  @ApiPropertyOptional({
    description: 'ID del usuario para filtrar pagos',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    description: 'ID de la suscripción para filtrar pagos',
    example: 'clx1234567890abcdef',
  })
  @IsString()
  @IsOptional()
  subscriptionId?: string;

  @ApiPropertyOptional({
    description: 'Método de pago para filtrar',
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;

  @ApiPropertyOptional({
    description: 'Estado del pago para filtrar',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

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
