import { Controller, Post, Get, Body, Param, HttpCode, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, SuperAdminRegisterDto, StoreAdminRegisterDto } from './dto/auth.dto';
import { AuthResponseDto, PasswordResetResponseDto } from './dto/auth-response.dto';
import { AuthRole } from './dto/auth.dto';
import { ValidRoles } from './interfaces/valid-roles';
import { SuperAdminRegisterGuard } from './guards/super-admin-register.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and return JWT token. Supports SUPER_ADMIN, STORE_ADMIN, and USER roles.',
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
        summary: 'Store Admin Response (Multiple Stores)',
        value: {
          id: 'uuid',
          email: 'storeadmin@example.com',
          firstName: 'Store',
          lastName: 'Admin',
          role: 'STORE_ADMIN',
          storeIds: ['store-123', 'store-456'],
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
      },
      user: {
        summary: 'Regular User Response',
        value: {
          id: 'uuid',
          email: 'user@example.com',
          firstName: 'Regular',
          lastName: 'User',
          role: 'USER',
          storeId: 'store-123',
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
      superAdmin: {
        summary: 'Super Admin Token Refresh',
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
        summary: 'Store Admin Token Refresh (Multiple Stores)',
        value: {
          id: 'uuid',
          email: 'storeadmin@example.com',
          firstName: 'Store',
          lastName: 'Admin',
          role: 'STORE_ADMIN',
          storeIds: ['store-123', 'store-456'],
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
      },
      user: {
        summary: 'User Token Refresh',
        value: {
          id: 'uuid',
          email: 'user@example.com',
          firstName: 'User',
          lastName: 'Name',
          role: 'USER',
          storeId: 'store-123',
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
  @UseGuards(SuperAdminRegisterGuard)
  @ApiOperation({
    summary: 'Register a new SUPER_ADMIN',
    description: 'Creates a new SUPER_ADMIN. If no SUPER_ADMIN exists in the system, this endpoint is public. Otherwise, requires authentication as SUPER_ADMIN.'
  })
  @ApiBody({
    type: SuperAdminRegisterDto,
    description: 'SuperAdmin registration data',
    examples: {
      firstAdmin: {
        summary: 'First SuperAdmin (Public)',
        value: {
          email: 'admin@mobixi.com',
          password: 'admin123',
          firstName: 'Super',
          lastName: 'Admin'
        }
      },
      additionalAdmin: {
        summary: 'Additional SuperAdmin (Requires Auth)',
        value: {
          email: 'superadmin2@mobixi.com',
          password: 'superadmin123',
          firstName: 'Super',
          lastName: 'Admin2'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'SuperAdmin created successfully', 
    type: AuthResponseDto,
    examples: {
      success: {
        summary: 'SuperAdmin Created Response',
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
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data or email already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Email already in use' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - Only SUPER_ADMIN can create additional SUPER_ADMINs',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Only SUPER_ADMIN can create additional SUPER_ADMINs' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  async registerSuperAdmin(@Body() dto: SuperAdminRegisterDto) {
    return this.authService.registerSuperAdmin(dto);
  }

  @Post('register/store-admin')
  @Auth(ValidRoles.SUPER_ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Register a new STORE_ADMIN',
    description: 'Creates a new STORE_ADMIN with access to multiple stores. Only accessible by authenticated SUPER_ADMIN users.'
  })
  @ApiBody({
    type: StoreAdminRegisterDto,
    description: 'StoreAdmin registration data with multiple store assignments',
    examples: {
      singleStore: {
        summary: 'Register StoreAdmin with Single Store',
        value: {
          email: 'admin@tienda.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'Tienda',
          storeIds: ['store-123']
        }
      },
      multipleStores: {
        summary: 'Register StoreAdmin with Multiple Stores',
        value: {
          email: 'multiadmin@tienda.com',
          password: 'admin123',
          firstName: 'Multi',
          lastName: 'Admin',
          storeIds: ['store-123', 'store-456', 'store-789']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'StoreAdmin created successfully with store assignments', 
    type: AuthResponseDto,
    examples: {
      success: {
        summary: 'StoreAdmin Created Response',
        value: {
          id: 'uuid',
          email: 'admin@tienda.com',
          firstName: 'Admin',
          lastName: 'Tienda',
          role: 'STORE_ADMIN',
          permissions: {},
          storeIds: ['store-123', 'store-456'],
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Invalid data or stores not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'One or more stores not found' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Only SUPER_ADMIN can access' })
  async registerStoreAdmin(@Body() dto: StoreAdminRegisterDto) {
    return this.authService.registerStoreAdmin(dto);
  }
}
