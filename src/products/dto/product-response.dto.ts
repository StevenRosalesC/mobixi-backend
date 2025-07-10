import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from './product.dto';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro'
  })
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with advanced camera features and A17 Pro chip'
  })
  description: string;

  @ApiProperty({
    description: 'Product price in cents',
    example: 99900
  })
  price: number;

  @ApiProperty({
    description: 'Product category',
    example: 'electronics'
  })
  category: string;

  @ApiProperty({
    description: 'Product type',
    enum: ProductType,
    example: ProductType.PHYSICAL
  })
  type: ProductType;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/images/iphone15pro.jpg'
  })
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Product stock quantity',
    example: 50
  })
  stock?: number;

  @ApiProperty({
    description: 'Whether the product is active/available',
    example: true
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Product SKU (Stock Keeping Unit)',
    example: 'IPH15PRO-128GB-BLACK'
  })
  sku?: string;

  @ApiPropertyOptional({
    description: 'Product weight in grams',
    example: 187
  })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Product dimensions',
    example: '147.7 x 71.5 x 7.85 mm'
  })
  dimensions?: string;

  @ApiProperty({
    description: 'Store ID where the product belongs',
    example: 'store-123'
  })
  storeId: string;

  @ApiProperty({
    description: 'Product creation timestamp',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update timestamp',
    example: '2024-01-20T14:45:00.000Z'
  })
  updatedAt: Date;
}

export class ProductPaginationDto {
  @ApiProperty({
    description: 'Array of products',
    type: [ProductResponseDto]
  })
  data: ProductResponseDto[];

  @ApiProperty({
    description: 'Total number of products matching the query',
    example: 150
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 15
  })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a next page',
    example: true
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false
  })
  hasPrevPage: boolean;
}
