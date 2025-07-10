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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionQueryDto,
  SubscriptionResponseDto,
  SubscriptionWithRelationsResponseDto,
  SubscriptionListResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { RoleProtected } from '../auth/decorators/role-protected/role-protected.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthRole } from '../auth/dto/auth.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@ApiBearerAuth('JWT-auth')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @RoleProtected(ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Create a new subscription',
    description: 'Creates a new subscription for a user and product',
  })
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User or product not found' })
  async create(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
    @GetUser() user: any,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionsService.create(
      createSubscriptionDto,
      user.role as AuthRole,
      user.storeId,
    );
    return subscription;
  }

  @Get()
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Get all subscriptions',
    description:
      'Retrieves a paginated list of subscriptions with optional filters',
  })
  @ApiQuery({
    name: 'storeId',
    required: false,
    description: 'Filter by store ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'productId',
    required: false,
    description: 'Filter by product ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by subscription status',
  })
  @ApiQuery({
    name: 'deliveryFrequency',
    required: false,
    description: 'Filter by delivery frequency',
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
    description: 'Subscriptions retrieved successfully',
    type: SubscriptionListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async findAll(
    @Query() query: SubscriptionQueryDto,
    @GetUser() user: any,
  ): Promise<SubscriptionListResponseDto> {
    const result = await this.subscriptionsService.findAll(
      query,
      user.role as AuthRole,
      user.storeId,
    );
    return result;
  }

  @Get('stats')
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Get subscription statistics',
    description: 'Retrieves statistics about subscriptions',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 100 },
        active: { type: 'number', example: 75 },
        paused: { type: 'number', example: 15 },
        cancelled: { type: 'number', example: 8 },
        expired: { type: 'number', example: 2 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async getStats(@GetUser() user: any) {
    return await this.subscriptionsService.getSubscriptionStats(
      user.role as AuthRole,
      user.storeId,
    );
  }

  @Get(':id')
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Get a subscription by ID',
    description: 'Retrieves a specific subscription by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription retrieved successfully',
    type: SubscriptionWithRelationsResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async findOne(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<SubscriptionWithRelationsResponseDto> {
    const subscription = await this.subscriptionsService.findOne(
      id,
      user.role as AuthRole,
      user.storeId,
    );
    return subscription;
  }

  @Patch(':id')
  @RoleProtected(ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Update a subscription',
    description: 'Updates an existing subscription',
  })
  @ApiBody({ type: UpdateSubscriptionDto })
  @ApiResponse({
    status: 200,
    description: 'Subscription updated successfully',
    type: SubscriptionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    @GetUser() user: any,
  ): Promise<SubscriptionResponseDto> {
    const subscription = await this.subscriptionsService.update(
      id,
      updateSubscriptionDto,
      user.role as AuthRole,
      user.storeId,
    );
    return subscription;
  }

  @Delete(':id')
  @RoleProtected(ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Delete a subscription',
    description: 'Deletes a subscription by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Subscription deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  async remove(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<{ message: string }> {
    await this.subscriptionsService.remove(
      id,
      user.role as AuthRole,
      user.storeId,
    );
    return { message: 'Subscription deleted successfully' };
  }
}
