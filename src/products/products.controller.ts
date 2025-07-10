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
import { Auth } from '../auth/decorators/auth.decorator';
import { Permission } from '../auth/decorators/permission.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { ValidModules } from '../auth/interfaces/valid-modules';
import { ValidActions } from '../auth/interfaces/valid-actions';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Public endpoints for users
  @Get()
  @Auth()
  @Permission(ValidModules.PRODUCTS, ValidActions.READ)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List products',
    description: 'Get a paginated list of products with optional filters. Requires authentication and READ permission for products module.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term to filter products by name or description',
    example: 'laptop'
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter products by category',
    example: 'electronics'
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Filter products by type',
    enum: ['PHYSICAL', 'DIGITAL', 'HYBRID'],
    example: 'PHYSICAL'
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter products by active status',
    example: true
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    description: 'Page number for pagination',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type: ProductPaginationDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'User does not have permission to read in products' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  findAll(@Query() query: ProductQueryDto, @GetUser() user) {
    return this.productsService.findAll(query, user);
  }

  @Get('active')
  @Auth()
  @Permission(ValidModules.PRODUCTS, ValidActions.READ)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List active products',
    description: 'Get a list of all active products. Requires authentication and READ permission for products module.',
  })
  @ApiResponse({
    status: 200,
    description: 'Active products retrieved successfully',
    type: [ProductResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'User does not have permission to read in products' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  getActiveProducts(@GetUser() user) {
    return this.productsService.getActiveProducts(user);
  }

  @Get(':id')
  @Auth()
  @Permission(ValidModules.PRODUCTS, ValidActions.READ)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Get detailed information of a specific product. Requires authentication and READ permission for products module.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'User does not have permission to read in products' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Product not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  findOne(@Param('id') id: string, @GetUser() user) {
    return this.productsService.findOne(id, user);
  }

  // Admin-only endpoints
  @Post()
  @Auth(ValidRoles.STORE_ADMIN, ValidRoles.SUPER_ADMIN)
  @Permission(ValidModules.PRODUCTS, ValidActions.CREATE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create product',
    description: 'Create a new product. Requires STORE_ADMIN or SUPER_ADMIN role and CREATE permission for products module.',
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid product data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['name should not be empty', 'price must be a positive number']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions or role',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'User does not have permission to create in products' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  create(@GetUser() user, @Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto, user);
  }

  @Patch(':id')
  @Auth(ValidRoles.STORE_ADMIN, ValidRoles.SUPER_ADMIN)
  @Permission(ValidModules.PRODUCTS, ValidActions.UPDATE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update product',
    description: 'Update an existing product. Requires STORE_ADMIN or SUPER_ADMIN role and UPDATE permission for products module.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid product data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['name should not be empty', 'price must be a positive number']
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions or role',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'User does not have permission to update in products' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Product not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  update(
    @GetUser() user,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.STORE_ADMIN, ValidRoles.SUPER_ADMIN)
  @Permission(ValidModules.PRODUCTS, ValidActions.DELETE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete product',
    description: 'Delete a product. Requires STORE_ADMIN or SUPER_ADMIN role and DELETE permission for products module.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
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
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions or role',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'User does not have permission to delete in products' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Product not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  remove(@GetUser() user, @Param('id') id: string) {
    return this.productsService.remove(id, user);
  }
}
