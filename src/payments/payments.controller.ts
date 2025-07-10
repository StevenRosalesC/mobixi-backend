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
import { PaymentsService } from './payments.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentQueryDto,
  PaymentResponseDto,
  PaymentWithRelationsResponseDto,
  PaymentListResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { RoleProtected } from '../auth/decorators/role-protected/role-protected.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthRole } from '../auth/dto/auth.dto';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@ApiBearerAuth('JWT-auth')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @RoleProtected(ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Create a new payment',
    description: 'Creates a new payment for a user',
  })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User or subscription not found' })
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @GetUser() user: any,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.create(
      createPaymentDto,
      user.role as AuthRole,
      user.storeId,
    );
    return payment;
  }

  @Get()
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Get all payments',
    description: 'Retrieves a paginated list of payments with optional filters',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'subscriptionId',
    required: false,
    description: 'Filter by subscription ID',
  })
  @ApiQuery({
    name: 'method',
    required: false,
    description: 'Filter by payment method',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by payment status',
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
    description: 'Payments retrieved successfully',
    type: PaymentListResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async findAll(
    @Query() query: PaymentQueryDto,
    @GetUser() user: any,
  ): Promise<PaymentListResponseDto> {
    const result = await this.paymentsService.findAll(
      query,
      user.role as AuthRole,
      user.storeId,
    );
    return result;
  }

  @Get('stats')
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Get payment statistics',
    description: 'Retrieves statistics about payments',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number', example: 100 },
        pending: { type: 'number', example: 15 },
        completed: { type: 'number', example: 75 },
        failed: { type: 'number', example: 5 },
        refunded: { type: 'number', example: 3 },
        cancelled: { type: 'number', example: 2 },
        totalAmount: { type: 'number', example: 3749.25 },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async getStats(@GetUser() user: any) {
    return await this.paymentsService.getPaymentStats(user.role as AuthRole, user.storeId);
  }

  @Get(':id')
  @RoleProtected(ValidRoles.SUPER_ADMIN, ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Get a payment by ID',
    description: 'Retrieves a specific payment by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment retrieved successfully',
    type: PaymentWithRelationsResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async findOne(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<PaymentWithRelationsResponseDto> {
    const payment = await this.paymentsService.findOne(
      id,
      user.role as AuthRole,
      user.storeId,
    );
    return payment;
  }

  @Patch(':id')
  @RoleProtected(ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Update a payment',
    description: 'Updates an existing payment',
  })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Payment updated successfully',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
    @GetUser() user: any,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentsService.update(
      id,
      updatePaymentDto,
      user.role as AuthRole,
      user.storeId,
    );
    return payment;
  }

  @Delete(':id')
  @RoleProtected(ValidRoles.STORE_ADMIN)
  @ApiOperation({
    summary: 'Delete a payment',
    description: 'Deletes a payment by its ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async remove(
    @Param('id') id: string,
    @GetUser() user: any,
  ): Promise<{ message: string }> {
    await this.paymentsService.remove(id, user.role as AuthRole, user.storeId);
    return { message: 'Payment deleted successfully' };
  }
}
