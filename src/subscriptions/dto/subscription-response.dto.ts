import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionStatus, DeliveryFrequency } from '@prisma/client';

export class SubscriptionResponseDto {
  @ApiProperty({
    description: 'ID único de la suscripción',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'ID de la tienda',
    example: 'clx1234567890abcdef',
  })
  storeId: string;

  @ApiProperty({
    description: 'Estado de la suscripción',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @ApiProperty({
    description: 'Fecha de inicio de la suscripción',
    example: '2024-01-15T10:30:00Z',
  })
  startDate: Date;

  @ApiPropertyOptional({
    description: 'Fecha de fin de la suscripción',
    example: '2024-12-31T23:59:59Z',
  })
  endDate?: Date | null;

  @ApiPropertyOptional({
    description: 'Fecha de la próxima entrega',
    example: '2024-02-15T10:30:00Z',
  })
  nextDeliveryDate?: Date | null;

  @ApiProperty({
    description: 'Frecuencia de entrega',
    enum: DeliveryFrequency,
    example: DeliveryFrequency.MONTHLY,
  })
  deliveryFrequency: DeliveryFrequency;

  @ApiProperty({
    description: 'Número total de entregas programadas',
    example: 12,
  })
  totalDeliveries: number;

  @ApiProperty({
    description: 'Número de entregas realizadas',
    example: 0,
  })
  deliveredCount: number;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la suscripción',
    example: 'Suscripción premium con entrega mensual',
  })
  notes?: string | null;

  @ApiProperty({
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  userId: string;

  @ApiProperty({
    description: 'ID del producto',
    example: 'clx1234567890abcdef',
  })
  productId: string;

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

export class SubscriptionWithRelationsResponseDto extends SubscriptionResponseDto {
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

  @ApiProperty({
    description: 'Información del producto',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clx1234567890abcdef' },
      name: { type: 'string', example: 'Caja Sorpresa Premium' },
      price: { type: 'number', example: 49.99 },
      type: { type: 'string', example: 'PHYSICAL' },
    },
  })
  product: {
    id: string;
    name: string;
    price: number;
    type: string;
  };

  @ApiProperty({
    description: 'Información de la tienda',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clx1234567890abcdef' },
      name: { type: 'string', example: 'Tienda Principal' },
    },
  })
  store: {
    id: string;
    name: string;
  };
}

export class SubscriptionListResponseDto {
  @ApiProperty({
    description: 'Lista de suscripciones',
    type: [SubscriptionWithRelationsResponseDto],
  })
  subscriptions: SubscriptionWithRelationsResponseDto[];

  @ApiProperty({
    description: 'Número total de suscripciones',
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
