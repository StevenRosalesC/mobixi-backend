import { Controller, Post, Get, Body, Param, HttpCode, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, SuperAdminRegisterDto, StoreAdminRegisterDto } from './dto/auth.dto';
import { AuthResponseDto, PasswordResetResponseDto } from './dto/auth-response.dto';
import { AuthRole } from './dto/auth.dto';
import { ValidRoles } from './interfaces/valid-roles';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a user (SuperAdmin, StoreAdmin, or User) and return JWT token with user information',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User credentials',
    examples: {
      superAdmin: {
        summary: 'Super Admin Login',
        value: {
          email: 'admin@mobixi.com',
          password: 'password'
        }
      },
      storeAdmin: {
        summary: 'Store Admin Login',
        value: {
          email: 'storeadmin@example.com',
          password: 'password123'
        }
      },
      user: {
        summary: 'Regular User Login',
        value: {
          email: 'user@example.com',
          password: 'password123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
    examples: {
      superAdmin: {
        summary: 'Super Admin Response',
        value: {
          id: 'uuid',
          email: 'admin@mobixi.com',
          firstName: 'Super',
          lastName: 'Admin',
          role: 'SUPER_ADMIN',
          permissions: {
            users: ['create', 'read', 'update', 'delete', 'manage'],
            stores: ['create', 'read', 'update', 'delete', 'manage'],
            products: ['create', 'read', 'update', 'delete', 'manage'],
            subscriptions: ['create', 'read', 'update', 'delete', 'manage'],
            deliveries: ['create', 'read', 'update', 'delete', 'manage'],
            payments: ['create', 'read', 'update', 'delete', 'manage'],
            reports: ['read', 'export', 'manage'],
            settings: ['read', 'update', 'manage']
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      },
      storeAdmin: {
        summary: 'Store Admin Response',
        value: {
          id: 'uuid',
          email: 'storeadmin@example.com',
          firstName: 'Store',
          lastName: 'Admin',
          role: 'STORE_ADMIN',
          storeId: 'store-uuid',
          permissions: {
            products: ['create', 'read', 'update', 'delete'],
            users: ['create', 'read', 'update'],
            subscriptions: ['create', 'read', 'update', 'delete'],
            deliveries: ['create', 'read', 'update', 'delete'],
            payments: ['read', 'update'],
            store: ['read', 'update']
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid credentials' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid email format or password too short',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['email must be an email', 'password must be longer than or equal to 6 characters']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get('refresh')
  @Auth()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Refresh JWT token',
    description: 'Refresh the current JWT token to extend the session. Requires valid JWT token in Authorization header.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
    examples: {
      success: {
        summary: 'Token Refresh Response',
        value: {
          id: 'uuid',
          email: 'user@example.com',
          firstName: 'User',
          lastName: 'Name',
          role: 'USER',
          storeId: 'store-uuid',
          permissions: {
            subscriptions: ['create', 'read', 'update'],
            deliveries: ['read'],
            payments: ['create', 'read'],
            profile: ['read', 'update']
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async refresh(@GetUser() user: any): Promise<AuthResponseDto> {
    return this.authService.refresh(user);
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send a password reset email to the user. The email will contain a link with a reset token.',
  })
  @ApiBody({
    type: ForgotPasswordDto,
    description: 'User email address',
    examples: {
      example: {
        summary: 'Forgot Password Request',
        value: {
          email: 'user@example.com'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset email sent successfully',
    type: PasswordResetResponseDto,
    examples: {
      success: {
        summary: 'Email Sent Response',
        value: {
          message: 'Password reset email sent'
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid email format',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['email must be an email']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<PasswordResetResponseDto> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password/:token')
  @ApiOperation({
    summary: 'Reset password with token',
    description: 'Reset the user password using the token received via email. The token expires in 1 hour.',
  })
  @ApiParam({
    name: 'token',
    description: 'Password reset token received via email',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJ1c2VyVHlwZSI6IlVTRVIiLCJpYXQiOjE2MzQ1Njc4OTAsImV4cCI6MTYzNDU3MTQ5MH0.example'
  })
  @ApiBody({
    type: ResetPasswordDto,
    description: 'New password',
    examples: {
      example: {
        summary: 'Reset Password Request',
        value: {
          newPassword: 'newSecurePassword123'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    type: PasswordResetResponseDto,
    examples: {
      success: {
        summary: 'Password Reset Response',
        value: {
          message: 'Password updated successfully'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid or expired token' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid password format',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['newPassword must be longer than or equal to 6 characters']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async resetPassword(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<PasswordResetResponseDto> {
    return this.authService.resetPassword(token, resetPasswordDto);
  }

  @Post('register/super-admin')
  @Auth(ValidRoles.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Register a new SUPER_ADMIN',
    description: 'Creates a new SUPER_ADMIN. Only accessible by authenticated SUPER_ADMIN users.'
  })
  @ApiBody({
    type: SuperAdminRegisterDto,
    description: 'SuperAdmin registration data',
    examples: {
      example: {
        summary: 'Register SuperAdmin',
        value: {
          email: 'superadmin2@mobixi.com',
          password: 'superadmin123',
          firstName: 'Super',
          lastName: 'Admin2'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'SuperAdmin created', type: AuthResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN can access' })
  async registerSuperAdmin(@Body() dto: SuperAdminRegisterDto) {
    return this.authService.registerSuperAdmin(dto);
  }

  @Post('register/store-admin')
  @Auth(ValidRoles.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Register a new STORE_ADMIN',
    description: 'Creates a new STORE_ADMIN for a specific store. Only accessible by authenticated SUPER_ADMIN users.'
  })
  @ApiBody({
    type: StoreAdminRegisterDto,
    description: 'StoreAdmin registration data',
    examples: {
      example: {
        summary: 'Register StoreAdmin',
        value: {
          email: 'admin@tienda.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'Tienda',
          storeId: 'store_001'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'StoreAdmin created', type: AuthResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN can access' })
  async registerStoreAdmin(@Body() dto: StoreAdminRegisterDto) {
    return this.authService.registerStoreAdmin(dto);
  }
}
