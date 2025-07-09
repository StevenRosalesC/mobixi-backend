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
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { DeliveriesService } from './deliveries.service';
import {
  CreateDeliveryDto,
  UpdateDeliveryDto,
  DeliveryQueryDto,
  DeliveryResponseDto,
  DeliveryWithRelationsResponseDto,
  DeliveryListResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { RoleProtected } from '../auth/decorators/role-protected/role-protected.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('deliveries')
@Controller('deliveries')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@ApiBearerAuth('JWT-auth')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  @RoleProtected(ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Create a new delivery',
    description: 'Creates a new delivery for a subscription',
  })
  @ApiBody({ type: CreateDeliveryDto })
  @ApiResponse({
    status: 201,
    description: 'Delivery created successfully',
    type: DeliveryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Subscription, product, or user not found',
  })
  async create(
    @Body() createDeliveryDto: CreateDeliveryDto,
    @GetUser() user: JwtPayload,
  ): Promise<DeliveryResponseDto> {
    const delivery = await this.deliveriesService.create(
      createDeliveryDto,
      user.role,
      user.storeId,
    );
    return delivery;
  }

  @Get()
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Get all deliveries',
    description:
      'Retrieves a paginated list of deliveries with optional filters',
  })
  @ApiQuery({
    name: 'subscriptionId',
    required: false,
    description: 'Filter by subscription ID',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by product ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by delivery status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Deliveries retrieved successfully',
    type: DeliveryListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async findAll(
    @Query() query: DeliveryQueryDto,
    @GetUser() user: JwtPayload,
  ): Promise<DeliveryListResponseDto> {
    const result = await this.deliveriesService.findAll(
      query,
      user.role,
      user.storeId,
    );
    return result;
  }

  @Get('stats')
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Get delivery statistics',
    description: 'Retrieves statistics about deliveries',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 100 },
        pending: { type: 'number', example: 25 },
        inTransit: { type: 'number', example: 15 },
        delivered: { type: 'number', example: 55 },
        failed: { type: 'number', example: 3 },
        cancelled: { type: 'number', example: 2 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async getStats(@GetUser() user: JwtPayload) {
    return await this.deliveriesService.getDeliveryStats(
      user.role,
      user.storeId,
    );
  }

  @Get(':id')
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Get a delivery by ID',
    description: 'Retrieves a specific delivery by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Delivery retrieved successfully',
    type: DeliveryWithRelationsResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async findOne(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
  ): Promise<DeliveryWithRelationsResponseDto> {
    const delivery = await this.deliveriesService.findOne(
      id,
      user.role,
      user.storeId,
    );
    return delivery;
  }

  @Patch(':id')
  @RoleProtected(ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Update a delivery',
    description: 'Updates an existing delivery',
  })
  @ApiBody({ type: UpdateDeliveryDto })
  @ApiResponse({
    status: 200,
    description: 'Delivery updated successfully',
    type: DeliveryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
    @GetUser() user: JwtPayload,
  ): Promise<DeliveryResponseDto> {
    const delivery = await this.deliveriesService.update(
      id,
      updateDeliveryDto,
      user.role,
      user.storeId,
    );
    return delivery;
  }

  @Delete(':id')
  @RoleProtected(ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Delete a delivery',
    description: 'Deletes a delivery by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Delivery deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Delivery not found' })
  async remove(
    @Param('id') id: string,
    @GetUser() user: JwtPayload,
  ): Promise<{ message: string }> {
    await this.deliveriesService.remove(id, user.role, user.storeId);
    return { message: 'Delivery deleted successfully' };
  }
}
