import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, IsBooleanString, IsNumberString } from 'class-validator';

export enum ProductType {
  PHYSICAL = 'PHYSICAL',
  DIGITAL = 'DIGITAL',
  HYBRID = 'HYBRID',
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Store ID where the product belongs',
    example: 'store-123',
  })
  @IsString()
  storeId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
    minLength: 1,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'Latest iPhone with advanced camera features and A17 Pro chip',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product price in cents (e.g., 99900 = $999.00)',
    example: 99900,
    minimum: 0,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Product category',
    example: 'electronics',
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: 'Product type',
    enum: ProductType,
    example: ProductType.PHYSICAL,
  })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/images/iphone15pro.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Whether the product is active/available',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum number of subscriptions allowed for this product',
    example: 100,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  maxSubscriptions?: number;
}

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'iPhone 15 Pro Max',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Updated description with new features',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product price in cents',
    example: 109900,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'smartphones',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Product type',
    enum: ProductType,
    example: ProductType.PHYSICAL,
  })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/images/iphone15promax.jpg',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Whether the product is active/available',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum number of subscriptions allowed for this product',
    example: 150,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  maxSubscriptions?: number;
}

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Search term to filter products by name or description',
    example: 'iphone',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter products by category',
    example: 'electronics',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter products by type',
    enum: ProductType,
    example: ProductType.PHYSICAL,
  })
  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @ApiPropertyOptional({
    description: 'Filter products by active status (true/false as string)',
    example: 'true',
    type: String,
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination (as string)',
    example: '1',
    minimum: 1,
    type: String,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    description: 'Number of items per page (as string)',
    example: '10',
    minimum: 1,
    maximum: 100,
    type: String,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}

