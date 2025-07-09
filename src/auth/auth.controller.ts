import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SuperAdminLoginDto,
  SuperAdminRegisterDto,
  StoreAdminLoginDto,
  StoreAdminRegisterDto,
  UserLoginDto,
  UserRegisterDto,
} from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // SuperAdmin registration (optional)
  @Post('superadmin/register')
  @ApiOperation({
    summary: 'Register new SuperAdmin',
    description: 'Creates a new SuperAdmin account',
  })
  @ApiBody({ type: SuperAdminRegisterDto })
  @ApiResponse({
    status: 201,
    description: 'SuperAdmin registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async superAdminRegister(@Body() dto: SuperAdminRegisterDto) {
    return this.authService.superAdminRegister(dto);
  }

  // SuperAdmin login
  @Post('superadmin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'SuperAdmin login',
    description: 'Authenticate a SuperAdmin and return JWT',
  })
  @ApiBody({ type: SuperAdminLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async superAdminLogin(@Body() dto: SuperAdminLoginDto) {
    return this.authService.superAdminLogin(dto);
  }

  // StoreAdmin registration
  @Post('storeadmin/register')
  @ApiOperation({
    summary: 'Register new StoreAdmin',
    description: 'Creates a new StoreAdmin for a store',
  })
  @ApiBody({ type: StoreAdminRegisterDto })
  @ApiResponse({
    status: 201,
    description: 'StoreAdmin registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async storeAdminRegister(@Body() dto: StoreAdminRegisterDto) {
    return this.authService.storeAdminRegister(dto);
  }

  // StoreAdmin login
  @Post('storeadmin/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'StoreAdmin login',
    description: 'Authenticate a StoreAdmin and return JWT',
  })
  @ApiBody({ type: StoreAdminLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async storeAdminLogin(@Body() dto: StoreAdminLoginDto) {
    return this.authService.storeAdminLogin(dto);
  }

  // User registration
  @Post('user/register')
  @ApiOperation({
    summary: 'Register new User',
    description: 'Creates a new User for a store',
  })
  @ApiBody({ type: UserRegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async userRegister(@Body() dto: UserRegisterDto) {
    return this.authService.userRegister(dto);
  }

  // User login
  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a User and return JWT',
  })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async userLogin(@Body() dto: UserLoginDto) {
    return this.authService.userLogin(dto);
  }
}
