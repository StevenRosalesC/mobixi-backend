import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ProductType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  HYBRID = 'HYBRID',
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Caja Sorpresa Premium',
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Caja sorpresa con productos premium seleccionados',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Código SKU del producto',
    example: 'CS-PREM-001',
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({
    description: 'Precio del producto',
    example: 49.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({
    description: 'Tipo de producto',
    enum: ProductType,
    example: ProductType.PHYSICAL,
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiPropertyOptional({
    description: 'Categoría del producto',
    example: 'Premium',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Límite máximo de suscripciones para este producto',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  maxSubscriptions?: number;

  @ApiProperty({
    description: 'ID de la tienda',
    example: 'store_001',
  })
  @IsString()
  storeId: string;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nombre del producto',
    example: 'Caja Sorpresa Premium Actualizada',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Caja sorpresa con productos premium seleccionados actualizada',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Código SKU del producto',
    example: 'CS-PREM-002',
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Precio del producto',
    example: 59.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  price?: number;

  @ApiPropertyOptional({
    description: 'Tipo de producto',
    enum: ProductType,
    example: ProductType.PHYSICAL,
  })
  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;

  @ApiPropertyOptional({
    description: 'Categoría del producto',
    example: 'Premium Plus',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/updated-image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    description: 'Estado activo del producto',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Límite máximo de suscripciones para este producto',
    example: 150,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  maxSubscriptions?: number;
}

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Término de búsqueda (nombre, descripción)',
    example: 'premium',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por categoría',
    example: 'Premium',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por tipo de producto',
    enum: ProductType,
    example: ProductType.PHYSICAL,
  })
  @IsEnum(ProductType, { message: 'type must be PHYSICAL, DIGITAL or HYBRID' })
  @IsOptional()
  type?: ProductType;

  @ApiPropertyOptional({
    description: 'Filtrar por estado activo',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Número de elementos por página',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}
