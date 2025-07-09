import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({
    description: 'Nombre de la tienda',
    example: 'Tienda Principal',
  })
  name: string;

  @ApiPropertyOptional({ description: 'Dirección', example: 'Calle 123' })
  address?: string;

  @ApiPropertyOptional({
    description: 'URL del logo',
    example: 'https://logo.com/logo.png',
  })
  logo?: string;
}

export class UpdateStoreDto {
  @ApiPropertyOptional({
    description: 'Nombre de la tienda',
    example: 'Tienda Actualizada',
  })
  name?: string;

  @ApiPropertyOptional({ description: 'Dirección', example: 'Nueva dirección' })
  address?: string;

  @ApiPropertyOptional({
    description: 'URL del logo',
    example: 'https://logo.com/logo-nuevo.png',
  })
  logo?: string;
}

export class StoreResponseDto {
  @ApiProperty({ description: 'ID de la tienda', example: 'uuid' })
  id: string;

  @ApiProperty({
    description: 'Nombre de la tienda',
    example: 'Tienda Principal',
  })
  name: string;

  @ApiPropertyOptional({ description: 'Dirección', example: 'Calle 123' })
  address?: string;

  @ApiPropertyOptional({
    description: 'URL del logo',
    example: 'https://logo.com/logo.png',
  })
  logo?: string;

  @ApiProperty({ description: 'Activo', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de actualización',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt: Date;
}
