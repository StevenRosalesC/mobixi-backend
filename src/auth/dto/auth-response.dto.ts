import { ApiProperty } from '@nestjs/swagger';

export class SuperAdminResponseDto {
  @ApiProperty({
    description: 'SuperAdmin unique ID',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'SuperAdmin email',
    example: 'superadmin@mobixi.com',
  })
  email: string;

  @ApiProperty({ description: 'First name', example: 'Super' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Admin' })
  lastName: string;
}

export class StoreAdminResponseDto {
  @ApiProperty({
    description: 'StoreAdmin unique ID',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({ description: 'StoreAdmin email', example: 'admin@tienda.com' })
  email: string;

  @ApiProperty({ description: 'First name', example: 'Admin' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Tienda' })
  lastName: string;

  @ApiProperty({ description: 'Store ID', example: 'store_001' })
  storeId: string;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'User unique ID',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({ description: 'User email', example: 'user@tienda.com' })
  email: string;

  @ApiProperty({ description: 'First name', example: 'User' })
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Tienda' })
  lastName: string;

  @ApiProperty({ description: 'Store ID', example: 'store_001' })
  storeId: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'SuperAdmin info',
    type: SuperAdminResponseDto,
    required: false,
  })
  superAdmin?: SuperAdminResponseDto;

  @ApiProperty({
    description: 'StoreAdmin info',
    type: StoreAdminResponseDto,
    required: false,
  })
  storeAdmin?: StoreAdminResponseDto;

  @ApiProperty({
    description: 'User info',
    type: UserResponseDto,
    required: false,
  })
  user?: UserResponseDto;
}
