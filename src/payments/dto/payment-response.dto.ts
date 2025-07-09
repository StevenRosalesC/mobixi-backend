import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class PaymentResponseDto {
  @ApiProperty({
    description: 'ID único del pago',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Monto del pago',
    example: 49.99,
  })
  amount: any;

  @ApiProperty({
    description: 'Método de pago',
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
  })
  method: PaymentMethod;

  @ApiProperty({
    description: 'Estado del pago',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @ApiPropertyOptional({
    description: 'Referencia del pago',
    example: 'PAY-2024-001',
  })
  reference?: string | null;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre el pago',
    example: 'Pago mensual de suscripción premium',
  })
  notes?: string | null;

  @ApiPropertyOptional({
    description: 'Fecha en que se realizó el pago',
    example: '2024-02-15T14:30:00Z',
  })
  paidAt?: Date | null;

  @ApiProperty({
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  userId: string;

  @ApiPropertyOptional({
    description: 'ID de la suscripción',
    example: 'clx1234567890abcdef',
  })
  subscriptionId?: string | null;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;
}

export class PaymentWithRelationsResponseDto extends PaymentResponseDto {
  @ApiProperty({
    description: 'Información del usuario',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clx1234567890abcdef' },
      email: { type: 'string', example: 'user@example.com' },
      firstName: { type: 'string', example: 'John' },
      lastName: { type: 'string', example: 'Doe' },
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };

  @ApiPropertyOptional({
    description: 'Información de la suscripción',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clx1234567890abcdef' },
      status: { type: 'string', example: 'ACTIVE' },
      deliveryFrequency: { type: 'string', example: 'MONTHLY' },
    },
  })
  subscription?: {
    id: string;
    status: any;
    deliveryFrequency: any;
  } | null;
}

export class PaymentListResponseDto {
  @ApiProperty({
    description: 'Lista de pagos',
    type: [PaymentWithRelationsResponseDto],
  })
  payments: PaymentWithRelationsResponseDto[];

  @ApiProperty({
    description: 'Número total de pagos',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Número de página actual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Número total de páginas',
    example: 10,
  })
  totalPages: number;
}
