import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  lastName: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono',
    example: '+593991234567',
  })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Dirección del usuario',
    example: 'Av. Amazonas 123',
  })
  address?: string;
}

export class AdminResponseDto {
  @ApiProperty({
    description: 'ID único del administrador',
    example: 'clx1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Email del administrador',
    example: 'admin@mobixi.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre del administrador',
    example: 'Admin',
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del administrador',
    example: 'Sistema',
  })
  lastName: string;

  @ApiProperty({
    description: 'Rol del administrador',
    example: 'ADMIN',
    enum: ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  })
  role: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticación',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'Información del usuario',
    type: UserResponseDto,
  })
  user?: UserResponseDto;

  @ApiProperty({
    description: 'Información del administrador',
    type: AdminResponseDto,
  })
  admin?: AdminResponseDto;
}
