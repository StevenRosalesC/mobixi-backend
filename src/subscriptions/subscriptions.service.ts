import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionQueryDto,
} from './dto';
import { Prisma, Subscription, SubscriptionStatus } from '@prisma/client';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<Subscription> {
    // Validate store access for STORE_ADMIN
    if (
      userRole === ValidRoles.STORE_ADMIN &&
      userStoreId !== createSubscriptionDto.storeId
    ) {
      throw new ForbiddenException(
        'You can only create subscriptions for your store',
      );
    }

    // Validate that user and product belong to the same store
    const [user, product] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: createSubscriptionDto.userId },
      }),
      this.prisma.product.findUnique({
        where: { id: createSubscriptionDto.productId },
      }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (
      user.storeId !== createSubscriptionDto.storeId ||
      product.storeId !== createSubscriptionDto.storeId
    ) {
      throw new BadRequestException(
        'User and product must belong to the same store',
      );
    }

    // Check if user already has an active subscription for this product
    const existingSubscription = await this.prisma.subscription.findFirst({
      where: {
        userId: createSubscriptionDto.userId,
        productId: createSubscriptionDto.productId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (existingSubscription) {
      throw new BadRequestException(
        'User already has an active subscription for this product',
      );
    }

    const subscriptionData: Prisma.SubscriptionCreateInput = {
      store: { connect: { id: createSubscriptionDto.storeId } },
      user: { connect: { id: createSubscriptionDto.userId } },
      product: { connect: { id: createSubscriptionDto.productId } },
      status: createSubscriptionDto.status || SubscriptionStatus.ACTIVE,
      startDate: createSubscriptionDto.startDate
        ? new Date(createSubscriptionDto.startDate)
        : new Date(),
      endDate: createSubscriptionDto.endDate
        ? new Date(createSubscriptionDto.endDate)
        : null,
      nextDeliveryDate: createSubscriptionDto.nextDeliveryDate
        ? new Date(createSubscriptionDto.nextDeliveryDate)
        : null,
      deliveryFrequency: createSubscriptionDto.deliveryFrequency || 'MONTHLY',
      totalDeliveries: createSubscriptionDto.totalDeliveries || 0,
      deliveredCount: createSubscriptionDto.deliveredCount || 0,
      notes: createSubscriptionDto.notes,
    };

    const subscription: Subscription = await this.prisma.subscription.create({
      data: subscriptionData,
    });

    return subscription;
  }

  async findAll(
    query: SubscriptionQueryDto,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<{
    subscriptions: (Subscription & {
      user: { id: string; email: string; firstName: string; lastName: string };
      product: { id: string; name: string; price: any; type: any };
      store: { id: string; name: string };
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
    const where: Prisma.SubscriptionWhereInput = {};

    // STORE_ADMIN can only see subscriptions from their store
    if (userRole === ValidRoles.STORE_ADMIN) {
      where.storeId = userStoreId;
    } else if (query.storeId) {
      where.storeId = query.storeId;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.deliveryFrequency) {
      where.deliveryFrequency = query.deliveryFrequency;
    }

    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
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
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              type: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscription.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      subscriptions,
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
    Subscription & {
      user: { id: string; email: string; firstName: string; lastName: string };
      product: { id: string; name: string; price: any; type: any };
      store: { id: string; name: string };
    }
  > {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            type: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Validate store access for STORE_ADMIN
    if (
      userRole === ValidRoles.STORE_ADMIN &&
      subscription.storeId !== userStoreId
    ) {
      throw new ForbiddenException(
        'You can only access subscriptions from your store',
      );
    }

    return subscription;
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<Subscription> {
    // First check if subscription exists and user has access
    const existingSubscription: Subscription | null =
      await this.prisma.subscription.findUnique({
        where: { id },
      });

    if (!existingSubscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Validate store access for STORE_ADMIN
    if (
      userRole === ValidRoles.STORE_ADMIN &&
      existingSubscription.storeId !== userStoreId
    ) {
      throw new ForbiddenException(
        'You can only update subscriptions from your store',
      );
    }

    const updateData: Prisma.SubscriptionUpdateInput = {};

    if (updateSubscriptionDto.status !== undefined) {
      updateData.status = updateSubscriptionDto.status;
    }

    if (updateSubscriptionDto.endDate !== undefined) {
      updateData.endDate = updateSubscriptionDto.endDate
        ? new Date(updateSubscriptionDto.endDate)
        : null;
    }

    if (updateSubscriptionDto.nextDeliveryDate !== undefined) {
      updateData.nextDeliveryDate = updateSubscriptionDto.nextDeliveryDate
        ? new Date(updateSubscriptionDto.nextDeliveryDate)
        : null;
    }

    if (updateSubscriptionDto.deliveryFrequency !== undefined) {
      updateData.deliveryFrequency = updateSubscriptionDto.deliveryFrequency;
    }

    if (updateSubscriptionDto.totalDeliveries !== undefined) {
      updateData.totalDeliveries = updateSubscriptionDto.totalDeliveries;
    }

    if (updateSubscriptionDto.deliveredCount !== undefined) {
      updateData.deliveredCount = updateSubscriptionDto.deliveredCount;
    }

    if (updateSubscriptionDto.notes !== undefined) {
      updateData.notes = updateSubscriptionDto.notes;
    }

    const subscription: Subscription = await this.prisma.subscription.update({
      where: { id },
      data: updateData,
    });

    return subscription;
  }

  async remove(
    id: string,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<void> {
    // First check if subscription exists and user has access
    const existingSubscription: Subscription | null =
      await this.prisma.subscription.findUnique({
        where: { id },
      });

    if (!existingSubscription) {
      throw new NotFoundException('Subscription not found');
    }

    // Validate store access for STORE_ADMIN
    if (
      userRole === ValidRoles.STORE_ADMIN &&
      existingSubscription.storeId !== userStoreId
    ) {
      throw new ForbiddenException(
        'You can only delete subscriptions from your store',
      );
    }

    await this.prisma.subscription.delete({
      where: { id },
    });
  }

  async getSubscriptionStats(
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<{
    total: number;
    active: number;
    paused: number;
    cancelled: number;
    expired: number;
  }> {
    const where: Prisma.SubscriptionWhereInput = {};

    // STORE_ADMIN can only see stats from their store
    if (userRole === ValidRoles.STORE_ADMIN) {
      where.storeId = userStoreId;
    }

    const [total, active, paused, cancelled, expired] = await Promise.all([
      this.prisma.subscription.count({ where }),
      this.prisma.subscription.count({
        where: { ...where, status: SubscriptionStatus.ACTIVE },
      }),
      this.prisma.subscription.count({
        where: { ...where, status: SubscriptionStatus.PAUSED },
      }),
      this.prisma.subscription.count({
        where: { ...where, status: SubscriptionStatus.CANCELLED },
      }),
      this.prisma.subscription.count({
        where: { ...where, status: SubscriptionStatus.EXPIRED },
      }),
    ]);

    return {
      total,
      active,
      paused,
      cancelled,
      expired,
    };
  }
}
