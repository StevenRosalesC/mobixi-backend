import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/store.dto';
import { UpdateStoreDto } from './dto/store.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { Permission } from '../auth/decorators/permission.decorator';
import { ValidModules } from '../auth/interfaces/valid-modules';
import { ValidActions } from '../auth/interfaces/valid-actions';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { GetUserStores } from '../auth/decorators/get-user-stores.decorator';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @Auth(ValidRoles.SUPER_ADMIN)
  @Permission(ValidModules.STORES, ValidActions.CREATE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create store',
    description: 'Create a new store. Requires SUPER_ADMIN role and CREATE permission for stores module.',
  })
  @ApiBody({
    type: CreateStoreDto,
    description: 'Store data',
    examples: {
      example: {
        summary: 'Create Store',
        value: {
          name: 'Tech Store',
          description: 'Premium electronics store',
          address: '123 Main St, City, State 12345',
          phone: '+1-555-0123',
          email: 'contact@techstore.com',
          website: 'https://techstore.com',
          isActive: true
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Store created successfully',
    type: CreateStoreDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid store data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['name should not be empty', 'email must be an email']
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
    description: 'Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'User does not have permission to create in stores' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  @Auth()
  @Permission(ValidModules.STORES, ValidActions.READ)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List stores',
    description: 'Get a list of stores. SUPER_ADMIN sees all stores. STORE_ADMIN sees only their assigned stores. USER sees only their store.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term to filter stores by name or description',
    example: 'tech'
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Filter stores by active status',
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
    description: 'Stores retrieved successfully',
    type: [CreateStoreDto],
    examples: {
      superAdmin: {
        summary: 'Super Admin Response - All Stores',
        value: [
          {
            id: 'store-123',
            name: 'Tech Store',
            address: '123 Main St, City, State 12345',
            logo: 'https://techstore.com/logo.png',
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          {
            id: 'store-456',
            name: 'Electronics Store',
            address: '456 Tech Ave, City, State 12345',
            logo: 'https://electronics.com/logo.png',
            isActive: true,
            createdAt: '2024-01-02T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z'
          }
        ]
      },
      storeAdmin: {
        summary: 'Store Admin Response - Assigned Stores Only',
        value: [
          {
            id: 'store-123',
            name: 'Tech Store',
            address: '123 Main St, City, State 12345',
            logo: 'https://techstore.com/logo.png',
            isActive: true,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
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
    description: 'Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'User does not have permission to read in stores' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  findAll(@GetUser() user: any, @GetUserStores() userStoreIds: string[]) {
    return this.storesService.findAll(user.role, userStoreIds);
  }

  @Get(':id')
  @Auth()
  @Permission(ValidModules.STORES, ValidActions.READ)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get store by ID',
    description: 'Get detailed information of a specific store. SUPER_ADMIN can access any store. STORE_ADMIN can only access their assigned stores. USER can only access their store.',
  })
  @ApiParam({
    name: 'id',
    description: 'Store unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Store retrieved successfully',
    type: CreateStoreDto,
    examples: {
      success: {
        summary: 'Store Details',
        value: {
          id: 'store-123',
          name: 'Tech Store',
          address: '123 Main St, City, State 12345',
          logo: 'https://techstore.com/logo.png',
          isActive: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
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
    description: 'Forbidden - insufficient permissions or store access denied',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only access your assigned stores' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Store not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Store not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  findOne(@Param('id') id: string, @GetUser() user: any, @GetUserStores() userStoreIds: string[]) {
    return this.storesService.findOne(id, user.role, userStoreIds);
  }

  @Patch(':id')
  @Auth(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @Permission(ValidModules.STORES, ValidActions.UPDATE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update store',
    description: 'Update an existing store. Requires SUPER_ADMIN or STORE_ADMIN role and UPDATE permission for stores module.',
  })
  @ApiParam({
    name: 'id',
    description: 'Store unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateStoreDto,
    description: 'Updated store data',
    examples: {
      example: {
        summary: 'Update Store',
        value: {
          name: 'Updated Tech Store',
          description: 'Updated description',
          address: '456 New St, City, State 12345',
          phone: '+1-555-0456',
          email: 'newcontact@techstore.com',
          website: 'https://newtechstore.com',
          isActive: true
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Store updated successfully',
    type: CreateStoreDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid store data',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'array', 
          items: { type: 'string' },
          example: ['name should not be empty', 'email must be an email']
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
    description: 'Forbidden - insufficient permissions',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'User does not have permission to update in stores' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Store not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Store not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  update(
    @Param('id') id: string, 
    @Body() updateStoreDto: UpdateStoreDto, 
    @GetUser() user: any,
    @GetUserStores() userStoreIds: string[]
  ) {
    return this.storesService.update(id, updateStoreDto, user.role, userStoreIds);
  }

  @Delete(':id')
  @Auth(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @Permission(ValidModules.STORES, ValidActions.DELETE)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete store',
    description: 'Delete a store. Requires SUPER_ADMIN or STORE_ADMIN role and DELETE permission for stores module.',
  })
  @ApiParam({
    name: 'id',
    description: 'Store unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Store deleted successfully',
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
        message: { type: 'string', example: 'User does not have permission to delete in stores' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Store not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Store not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  remove(@Param('id') id: string, @GetUser() user: any, @GetUserStores() userStoreIds: string[]) {
    return this.storesService.remove(id, user.role, userStoreIds);
  }
}
