import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import {
  ProductResponseDto,
  ProductPaginationDto,
} from './dto/product-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { RoleProtected } from '../auth/decorators/role-protected/role-protected.decorator';
import { Permission } from '../auth/decorators/permission.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Public endpoints for users
  @Get()
  @ApiOperation({
    summary: 'Listar productos',
    description:
      'Obtiene una lista paginada de productos con filtros opcionales',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Término de búsqueda',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrar por categoría',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filtrar por tipo de producto',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filtrar por estado activo',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Elementos por página',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida exitosamente',
    type: ProductPaginationDto,
  })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Listar productos activos',
    description: 'Obtiene una lista de todos los productos activos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos activos obtenida exitosamente',
    type: [ProductResponseDto],
  })
  getActiveProducts() {
    return this.productsService.getActiveProducts();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener producto por ID',
    description: 'Obtiene la información detallada de un producto específico',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto obtenido exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // Admin-only endpoints
  @Post()
  @UseGuards(JwtAuthGuard, UserRoleGuard, PermissionGuard)
  @RoleProtected(ValidRoles.ADMIN, ValidRoles.SUPER_ADMIN)
  @Permission('products', 'create')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Crear producto',
    description: 'Crea un nuevo producto (solo administradores)',
  })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos suficientes',
  })
  create(@GetUser() user, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserRoleGuard, PermissionGuard)
  @RoleProtected(ValidRoles.ADMIN, ValidRoles.SUPER_ADMIN)
  @Permission('products', 'update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Actualizar producto',
    description: 'Actualiza un producto existente (solo administradores)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos suficientes',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  update(
    @GetUser() user,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserRoleGuard, PermissionGuard)
  @RoleProtected(ValidRoles.ADMIN, ValidRoles.SUPER_ADMIN)
  @Permission('products', 'delete')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Eliminar producto',
    description: 'Elimina un producto (solo administradores)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del producto',
    example: 'clx1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Product deleted successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos suficientes',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  remove(@GetUser() user, @Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
