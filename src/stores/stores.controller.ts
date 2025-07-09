import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { StoresService } from './stores.service';
import {
  CreateStoreDto,
  UpdateStoreDto,
  StoreResponseDto,
} from './dto/store.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { RoleProtected } from '../auth/decorators/role-protected/role-protected.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('stores')
@Controller('stores')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@ApiBearerAuth('JWT-auth')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @RoleProtected(ValidRoles.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Crear tienda',
    description: 'Crea una nueva tienda (solo SUPER_ADMIN)',
  })
  @ApiBody({ type: CreateStoreDto })
  @ApiResponse({
    status: 201,
    description: 'Tienda creada',
    type: StoreResponseDto,
  })
  async create(@Body() dto: CreateStoreDto): Promise<StoreResponseDto> {
    return this.storesService.create(dto);
  }

  @Get()
  @RoleProtected(ValidRoles.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Listar tiendas',
    description: 'Lista todas las tiendas (solo SUPER_ADMIN)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tiendas',
    type: [StoreResponseDto],
  })
  async findAll(): Promise<StoreResponseDto[]> {
    return this.storesService.findAll();
  }

  @Get(':id')
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Obtener tienda',
    description:
      'Obtiene una tienda por ID (SUPER_ADMIN o STORE_ADMIN solo su tienda)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tienda encontrada',
    type: StoreResponseDto,
  })
  async findOne(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
  ): Promise<StoreResponseDto> {
    if (user.role === ValidRoles.STORE_ADMIN && user.storeId !== id) {
      throw new Error('You can only access your own store');
    }
    return this.storesService.findOne(id);
  }

  @Patch(':id')
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Actualizar tienda',
    description:
      'Actualiza una tienda (SUPER_ADMIN cualquier tienda, STORE_ADMIN solo la suya)',
  })
  @ApiBody({ type: UpdateStoreDto })
  @ApiResponse({
    status: 200,
    description: 'Tienda actualizada',
    type: StoreResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateStoreDto,
    @GetUser() user: JwtPayload,
  ): Promise<StoreResponseDto> {
    return this.storesService.update(id, dto, user.role, user.storeId);
  }

  @Delete(':id')
  @RoleProtected(ValidRoles.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar tienda',
    description: 'Elimina una tienda (solo SUPER_ADMIN)',
  })
  @ApiResponse({ status: 204, description: 'Tienda eliminada' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.storesService.remove(id);
  }
}
