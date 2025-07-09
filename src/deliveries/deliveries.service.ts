import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryDto, UpdateDeliveryDto, DeliveryQueryDto } from './dto';
import { Prisma, Delivery, DeliveryStatus } from '@prisma/client';

@Injectable()
export class DeliveriesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDeliveryDto: CreateDeliveryDto,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<Delivery> {
    // Validate that subscription, product, and user belong to the same store
    const [subscription, product, user] = await Promise.all([
      this.prisma.subscription.findUnique({
        where: { id: createDeliveryDto.subscriptionId },
        include: { store: true },
      }),
      this.prisma.product.findUnique({
        where: { id: createDeliveryDto.productId },
        include: { store: true },
      }),
      this.prisma.user.findUnique({
        where: { id: createDeliveryDto.userId },
        include: { store: true },
      }),
    ]);

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate store access for STORE_ADMIN
    if (userRole === 'STORE_ADMIN' && userStoreId !== subscription.storeId) {
      throw new ForbiddenException(
        'You can only create deliveries for your store',
      );
    }

    // Validate that all entities belong to the same store
    if (
      subscription.storeId !== product.storeId ||
      subscription.storeId !== user.storeId
    ) {
      throw new BadRequestException(
        'Subscription, product, and user must belong to the same store',
      );
    }

    const deliveryData: Prisma.DeliveryCreateInput = {
      subscription: { connect: { id: createDeliveryDto.subscriptionId } },
      product: { connect: { id: createDeliveryDto.productId } },
      user: { connect: { id: createDeliveryDto.userId } },
      status: createDeliveryDto.status || DeliveryStatus.PENDING,
      scheduledDate: new Date(createDeliveryDto.scheduledDate),
      deliveredDate: createDeliveryDto.deliveredDate
        ? new Date(createDeliveryDto.deliveredDate)
        : null,
      trackingCode: createDeliveryDto.trackingCode,
      notes: createDeliveryDto.notes,
    };

    const delivery: Delivery = await this.prisma.delivery.create({
      data: deliveryData,
    });

    return delivery;
  }

  async findAll(
    query: DeliveryQueryDto,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<{
    deliveries: (Delivery & {
      subscription: { id: string; status: string; deliveryFrequency: string };
      product: { id: string; name: string; price: any; type: any };
      user: { id: string; email: string; firstName: string; lastName: string };
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
    const where: Prisma.DeliveryWhereInput = {};

    if (query.subscriptionId) {
      where.subscriptionId = query.subscriptionId;
    }

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.userId) {
      where.userId = query.userId;
    }

    if (query.status) {
      where.status = query.status;
    }

    // STORE_ADMIN can only see deliveries from their store
    if (userRole === 'STORE_ADMIN') {
      where.subscription = {
        storeId: userStoreId,
      };
    }

    const [deliveries, total] = await Promise.all([
      this.prisma.delivery.findMany({
        where,
        include: {
          subscription: {
            select: {
              id: true,
              status: true,
              deliveryFrequency: true,
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
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.delivery.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      deliveries,
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
    Delivery & {
      subscription: { id: string; status: string; deliveryFrequency: string };
      product: { id: string; name: string; price: any; type: any };
      user: { id: string; email: string; firstName: string; lastName: string };
    }
  > {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: {
        subscription: {
          select: {
            id: true,
            status: true,
            deliveryFrequency: true,
            storeId: true,
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
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    // Validate store access for STORE_ADMIN
    if (
      userRole === 'STORE_ADMIN' &&
      delivery.subscription.storeId !== userStoreId
    ) {
      throw new ForbiddenException(
        'You can only access deliveries from your store',
      );
    }

    return delivery;
  }

  async update(
    id: string,
    updateDeliveryDto: UpdateDeliveryDto,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<Delivery> {
    // First check if delivery exists and user has access
    const existingDelivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: {
        subscription: {
          select: {
            storeId: true,
          },
        },
      },
    });

    if (!existingDelivery) {
      throw new NotFoundException('Delivery not found');
    }

    // Validate store access for STORE_ADMIN
    if (
      userRole === 'STORE_ADMIN' &&
      existingDelivery.subscription.storeId !== userStoreId
    ) {
      throw new ForbiddenException(
        'You can only update deliveries from your store',
      );
    }

    const updateData: Prisma.DeliveryUpdateInput = {};

    if (updateDeliveryDto.status !== undefined) {
      updateData.status = updateDeliveryDto.status;
    }

    if (updateDeliveryDto.deliveredDate !== undefined) {
      updateData.deliveredDate = updateDeliveryDto.deliveredDate
        ? new Date(updateDeliveryDto.deliveredDate)
        : null;
    }

    if (updateDeliveryDto.trackingCode !== undefined) {
      updateData.trackingCode = updateDeliveryDto.trackingCode;
    }

    if (updateDeliveryDto.notes !== undefined) {
      updateData.notes = updateDeliveryDto.notes;
    }

    const delivery: Delivery = await this.prisma.delivery.update({
      where: { id },
      data: updateData,
    });

    return delivery;
  }

  async remove(
    id: string,
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<void> {
    // First check if delivery exists and user has access
    const existingDelivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: {
        subscription: {
          select: {
            storeId: true,
          },
        },
      },
    });

    if (!existingDelivery) {
      throw new NotFoundException('Delivery not found');
    }

    // Validate store access for STORE_ADMIN
    if (
      userRole === 'STORE_ADMIN' &&
      existingDelivery.subscription.storeId !== userStoreId
    ) {
      throw new ForbiddenException(
        'You can only delete deliveries from your store',
      );
    }

    await this.prisma.delivery.delete({
      where: { id },
    });
  }

  async getDeliveryStats(
    userRole: 'SUPER_ADMIN' | 'STORE_ADMIN' | 'USER',
    userStoreId?: string,
  ): Promise<{
    total: number;
    pending: number;
    inTransit: number;
    delivered: number;
    failed: number;
    cancelled: number;
  }> {
    const where: Prisma.DeliveryWhereInput = {};

    // STORE_ADMIN can only see stats from their store
    if (userRole === 'STORE_ADMIN') {
      where.subscription = {
        storeId: userStoreId,
      };
    }

    const [total, pending, inTransit, delivered, failed, cancelled] =
      await Promise.all([
        this.prisma.delivery.count({ where }),
        this.prisma.delivery.count({
          where: { ...where, status: DeliveryStatus.PENDING },
        }),
        this.prisma.delivery.count({
          where: { ...where, status: DeliveryStatus.IN_TRANSIT },
        }),
        this.prisma.delivery.count({
          where: { ...where, status: DeliveryStatus.DELIVERED },
        }),
        this.prisma.delivery.count({
          where: { ...where, status: DeliveryStatus.FAILED },
        }),
        this.prisma.delivery.count({
          where: { ...where, status: DeliveryStatus.CANCELLED },
        }),
      ]);

    return {
      total,
      pending,
      inTransit,
      delivered,
      failed,
      cancelled,
    };
  }
}
