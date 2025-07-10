import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AuthRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STORE_ADMIN = 'STORE_ADMIN',
  USER = 'USER',
}

// SuperAdmin login
export class SuperAdminLoginDto {
  @ApiProperty({
    description: 'SuperAdmin email',
    example: 'superadmin@mobixi.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (min 6 chars)',
    example: 'superadmin123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class SuperAdminRegisterDto {
  @ApiProperty({ description: 'SuperAdmin email', example: 'superadmin@mobixi.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (min 6 chars)', example: 'superadmin123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'First name', example: 'Super' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Admin' })
  @IsString()
  lastName: string;
}

// StoreAdmin login
export class StoreAdminLoginDto {
  @ApiProperty({ description: 'StoreAdmin email', example: 'admin@tienda.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (min 6 chars)',
    example: 'admin123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class StoreAdminRegisterDto {
  @ApiProperty({ description: 'StoreAdmin email', example: 'admin@tienda.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password (min 6 chars)', example: 'admin123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'First name', example: 'Admin' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Tienda' })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    description: 'Array of Store IDs', 
    example: ['store_001', 'store_002'],
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  storeIds: string[];
}

// User login
export class UserLoginDto {
  @ApiProperty({ description: 'User email', example: 'user@tienda.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (min 6 chars)',
    example: 'user123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

// User register
export class UserRegisterDto {
  @ApiProperty({ description: 'User email', example: 'user@tienda.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password (min 6 chars)',
    example: 'user123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'First name', example: 'User' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Tienda' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Store ID', example: 'store_001' })
  @IsString()
  storeId: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'User email address',
    example: 'admin@mobixi.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 6 characters)',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address to send password reset link',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'New password (minimum 6 characters)',
    example: 'newSecurePassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Current JWT token to refresh',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  token: string;
}
