import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
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

// SuperAdmin register (opcional, normalmente solo uno creado por seed)
export class SuperAdminRegisterDto {
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

// StoreAdmin register
export class StoreAdminRegisterDto {
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

  @ApiProperty({ description: 'First name', example: 'Admin' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Last name', example: 'Tienda' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Store ID', example: 'store_001' })
  @IsString()
  storeId: string;
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
