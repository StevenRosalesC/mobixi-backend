import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeliveryStatus } from '@prisma/client';

export class DeliveryResponseDto {
  @ApiProperty({
    description: 'ID único de la entrega',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Estado de la entrega',
    enum: DeliveryStatus,
    example: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @ApiProperty({
    description: 'Fecha programada para la entrega',
    example: '2024-02-15T10:30:00Z',
  })
  scheduledDate: Date;

  @ApiPropertyOptional({
    description: 'Fecha en que se realizó la entrega',
    example: '2024-02-15T14:30:00Z',
  })
  deliveredDate?: Date | null;

  @ApiPropertyOptional({
    description: 'Código de seguimiento de la entrega',
    example: 'TRK123456789',
  })
  trackingCode?: string | null;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la entrega',
    example: 'Entregado en recepción del edificio',
  })
  notes?: string | null;

  @ApiProperty({
    description: 'ID de la suscripción',
    example: 'clx1234567890abcdef',
  })
  subscriptionId: string;

  @ApiProperty({
    description: 'ID del producto',
    example: 'clx1234567890abcdef',
  })
  productId: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: 'clx1234567890abcdef',
  })
  userId: string;

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

export class DeliveryWithRelationsResponseDto extends DeliveryResponseDto {
  @ApiProperty({
    description: 'Información de la suscripción',
    type: 'object',
    properties: {
      id: { type: 'string', example: 'clx1234567890abcdef' },
      status: { type: 'string', example: 'ACTIVE' },
      deliveryFrequency: { type: 'string', example: 'MONTHLY' },
    },
  })
  subscription: {
    id: string;
    status: string;
    deliveryFrequency: string;
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
    price: any;
    type: any;
  };

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
}

export class DeliveryListResponseDto {
  @ApiProperty({
    description: 'Lista de entregas',
    type: [DeliveryWithRelationsResponseDto],
  })
  deliveries: DeliveryWithRelationsResponseDto[];

  @ApiProperty({
    description: 'Número total de entregas',
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
