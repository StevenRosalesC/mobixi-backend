import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEmail, IsUrl } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    description: 'Store name',
    example: 'Tech Store',
    minLength: 1,
  })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Store description',
    example: 'Premium electronics store with the latest gadgets',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Store address',
    example: '123 Main St, City, State 12345',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Store phone number',
    example: '+1-555-0123',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Store email address',
    example: 'contact@techstore.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Store website URL',
    example: 'https://techstore.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Store logo URL',
    example: 'https://techstore.com/logo.png',
  })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Whether the store is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateStoreDto {
  @ApiPropertyOptional({
    description: 'Store name',
    example: 'Updated Tech Store',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Store description',
    example: 'Updated store description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Store address',
    example: '456 New St, City, State 12345',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Store phone number',
    example: '+1-555-0456',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Store email address',
    example: 'newcontact@techstore.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'Store website URL',
    example: 'https://newtechstore.com',
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({
    description: 'Store logo URL',
    example: 'https://newtechstore.com/logo.png',
  })
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({
    description: 'Whether the store is active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class StoreResponseDto {
  @ApiProperty({
    description: 'Store unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'Store name',
    example: 'Tech Store'
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Store address',
    example: '123 Main St, City, State 12345'
  })
  address?: string;

  @ApiPropertyOptional({
    description: 'Store logo URL',
    example: 'https://techstore.com/logo.png'
  })
  logo?: string;

  @ApiProperty({
    description: 'Whether the store is active',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Store creation timestamp',
    example: '2024-01-15T10:30:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Store last update timestamp',
    example: '2024-01-20T14:45:00.000Z'
  })
  updatedAt: Date;
}
