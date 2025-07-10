import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiProperty({ 
    description: 'Array of Store IDs', 
    example: ['store_001', 'store_002'],
    type: [String]
  })
  storeIds: string[];
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
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'admin@mobixi.com'
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John'
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe'
  })
  lastName: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: ['SUPER_ADMIN', 'STORE_ADMIN', 'USER'],
    example: 'SUPER_ADMIN'
  })
  role: string;

  @ApiProperty({
    description: 'User permissions by module',
    example: {
      users: ['create', 'read', 'update', 'delete', 'manage'],
      stores: ['create', 'read', 'update', 'delete', 'manage'],
      products: ['create', 'read', 'update', 'delete', 'manage'],
      subscriptions: ['create', 'read', 'update', 'delete', 'manage'],
      deliveries: ['create', 'read', 'update', 'delete', 'manage'],
      payments: ['create', 'read', 'update', 'delete', 'manage'],
      reports: ['read', 'export', 'manage'],
      settings: ['read', 'update', 'manage']
    }
  })
  permissions: any;

  @ApiPropertyOptional({
    description: 'Store ID (only for USER role)',
    example: 'store-123'
  })
  storeId?: string;

  @ApiPropertyOptional({
    description: 'Array of Store IDs (only for STORE_ADMIN role)',
    example: ['store-123', 'store-456'],
    type: [String]
  })
  storeIds?: string[];

  @ApiProperty({
    description: 'JWT token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyM2U0NTY3LWU4OWItMTJkMy1hNDU2LTQyNjYxNDE3NDAwMCIsImVtYWlsIjoiYWRtaW5AbW9iaXhpLmNvbSIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjY2MTIzNDkwfQ.example'
  })
  token: string;
}

export class PasswordResetResponseDto {
  @ApiProperty({
    description: 'Response message',
    example: 'Password reset email sent'
  })
  message: string;
}
