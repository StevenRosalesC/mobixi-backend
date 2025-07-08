import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from './product.dto';

export class ProductResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Caja Sorpresa Premium',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Caja sorpresa con productos premium seleccionados',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Código SKU del producto',
    example: 'CS-PREM-001',
  })
  sku?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 49.99,
  })
  price: number;

  @ApiProperty({
    description: 'Precio de costo del producto',
    example: 35.0,
  })
  costPrice: number;

  @ApiProperty({
    description: 'Tipo de producto',
    enum: ProductType,
    example: ProductType.PHYSICAL,
  })
  type: ProductType;

  @ApiPropertyOptional({
    description: 'Categoría del producto',
    example: 'Premium',
  })
  category?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.jpg',
  })
  image?: string;

  @ApiProperty({
    description: 'Estado activo del producto',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Límite máximo de suscripciones',
    example: 100,
  })
  maxSubscriptions?: number;

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

export class ProductPaginationDto {
  @ApiProperty({
    description: 'Lista de productos',
    type: [ProductResponseDto],
  })
  products: ProductResponseDto[];

  @ApiProperty({
    description: 'Información de paginación',
    type: 'object',
    properties: {
      page: { type: 'number', example: 1 },
      limit: { type: 'number', example: 10 },
      total: { type: 'number', example: 25 },
      pages: { type: 'number', example: 3 },
    },
  })
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
