import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentQueryDto } from './dto';
import { Prisma, Payment, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<Payment> {
    // Validate that user exists and belongs to the correct store
    const user = await this.prisma.user.findUnique({
      where: { id: createPaymentDto.userId },
      include: { store: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate store access for STORE_ADMIN
    if (userRole === 'STORE_ADMIN' && userStoreId !== user.storeId) {
      throw new ForbiddenException(
        'You can only create payments for users in your store',
      );
    }

    // Validate subscription if provided
    if (createPaymentDto.subscriptionId) {
      const subscription = await this.prisma.subscription.findUnique({
        where: { id: createPaymentDto.subscriptionId },
        include: { store: true },
      });

      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }

      if (subscription.storeId !== user.storeId) {
        throw new BadRequestException(
          'Subscription must belong to the same store as the user',
        );
      }
    }

    const paymentData: Prisma.PaymentCreateInput = {
      user: { connect: { id: createPaymentDto.userId } },
      subscription: createPaymentDto.subscriptionId
        ? { connect: { id: createPaymentDto.subscriptionId } }
        : undefined,
      amount: createPaymentDto.amount,
      method: createPaymentDto.method || 'MANUAL',
      status: createPaymentDto.status || PaymentStatus.PENDING,
      reference: createPaymentDto.reference,
      notes: createPaymentDto.notes,
      paidAt: createPaymentDto.paidAt
        ? new Date(createPaymentDto.paidAt)
        : null,
    };

    const payment: Payment = await this.prisma.payment.create({
      data: paymentData,
    });

    return payment;
  }

  async findAll(
    query: PaymentQueryDto,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<{
    payments: (Payment & {
      user: { id: string; email: string; firstName: string; lastName: string };
      subscription?: { id: string; status: any; deliveryFrequency: any } | null;
    })[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    // Build where clause with multi-tenant filtering
    const where: Prisma.PaymentWhereInput = {};

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.subscriptionId) {
      where.subscriptionId = query.subscriptionId;
    }

    if (query.method) {
      where.method = query.method;
    }

    if (query.status) {
      where.status = query.status;
    }

    // STORE_ADMIN can only see payments from their store
    if (userRole === 'STORE_ADMIN') {
      where.user = {
        storeId: userStoreId,
      };
    }

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          subscription: {
            select: {
              id: true,
              status: true,
              deliveryFrequency: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      payments,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(
    id: string,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<
    Payment & {
      user: { id: string; email: string; firstName: string; lastName: string };
      subscription?: { id: string; status: any; deliveryFrequency: any } | null;
    }
  > {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            storeId: true,
          },
        },
        subscription: {
          select: {
            id: true,
            status: true,
            deliveryFrequency: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Validate store access for STORE_ADMIN
    if (userRole === 'STORE_ADMIN' && payment.user.storeId !== userStoreId) {
      throw new ForbiddenException(
        'You can only access payments from your store',
      );
    }

    return payment;
  }

  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<Payment> {
    // First check if payment exists and user has access
    const existingPayment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            storeId: true,
          },
        },
      },
    });

    if (!existingPayment) {
      throw new NotFoundException('Payment not found');
    }

    // Validate store access for STORE_ADMIN
    if (
      userRole === 'STORE_ADMIN' &&
      existingPayment.user.storeId !== userStoreId
    ) {
      throw new ForbiddenException(
        'You can only update payments from your store',
      );
    }

    const updateData: Prisma.PaymentUpdateInput = {};

    if (updatePaymentDto.method !== undefined) {
      updateData.method = updatePaymentDto.method;
    }

    if (updatePaymentDto.status !== undefined) {
      updateData.status = updatePaymentDto.status;
    }

    if (updatePaymentDto.reference !== undefined) {
      updateData.reference = updatePaymentDto.reference;
    }

    if (updatePaymentDto.notes !== undefined) {
      updateData.notes = updatePaymentDto.notes;
    }

    if (updatePaymentDto.paidAt !== undefined) {
      updateData.paidAt = updatePaymentDto.paidAt
        ? new Date(updatePaymentDto.paidAt)
        : null;
    }

    const payment: Payment = await this.prisma.payment.update({
      where: { id },
      data: updateData,
    });

    return payment;
  }

  async remove(
    id: string,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<void> {
    // First check if payment exists and user has access
    const existingPayment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            storeId: true,
          },
        },
      },
    });

    if (!existingPayment) {
      throw new NotFoundException('Payment not found');
    }

    // Validate store access for STORE_ADMIN
    if (
      userRole === 'STORE_ADMIN' &&
      existingPayment.user.storeId !== userStoreId
    ) {
      throw new ForbiddenException(
        'You can only delete payments from your store',
      );
    }

    await this.prisma.payment.delete({
      where: { id },
    });
  }

  async getPaymentStats(
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<{
    total: number;
    pending: number;
    completed: number;
    failed: number;
    refunded: number;
    cancelled: number;
    totalAmount: number;
  }> {
    const where: Prisma.PaymentWhereInput = {};

    // STORE_ADMIN can only see stats from their store
    if (userRole === 'STORE_ADMIN') {
      where.user = {
        storeId: userStoreId,
      };
    }

    const [
      total,
      pending,
      completed,
      failed,
      refunded,
      cancelled,
      totalAmount,
    ] = await Promise.all([
      this.prisma.payment.count({ where }),
      this.prisma.payment.count({
        where: { ...where, status: PaymentStatus.PENDING },
      }),
      this.prisma.payment.count({
        where: { ...where, status: PaymentStatus.COMPLETED },
      }),
      this.prisma.payment.count({
        where: { ...where, status: PaymentStatus.FAILED },
      }),
      this.prisma.payment.count({
        where: { ...where, status: PaymentStatus.REFUNDED },
      }),
      this.prisma.payment.count({
        where: { ...where, status: PaymentStatus.CANCELLED },
      }),
      this.prisma.payment.aggregate({
        where: { ...where, status: PaymentStatus.COMPLETED },
        _sum: { amount: true },
      }),
    ]);

    return {
      total,
      pending,
      completed,
      failed,
      refunded,
      cancelled,
      totalAmount: totalAmount._sum.amount?.toNumber() || 0,
    };
  }
}
