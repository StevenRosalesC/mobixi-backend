import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { AuthRole } from '../auth/dto/auth.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: JwtPayload) {
    // Validate store access for StoreAdmin
    if (
      user.role === AuthRole.STORE_ADMIN &&
      user.storeId !== createProductDto.storeId
    ) {
      throw new ForbiddenException(
        'You can only create products for your store',
      );
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        price: new Prisma.Decimal(createProductDto.price),
      },
    });

    return product;
  }

  async findAll(query: ProductQueryDto, user?: JwtPayload) {
    const { search, category, type, isActive, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    // Filter by store for StoreAdmin and User
    if (user && user.role !== AuthRole.SUPER_ADMIN) {
      where.storeId = user.storeId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (type) {
      where.type = type;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user?: JwtPayload) {
    const where: Prisma.ProductWhereUniqueInput = { id };

    // Filter by store for StoreAdmin and User
    if (user && user.role !== AuthRole.SUPER_ADMIN) {
      const product = await this.prisma.product.findFirst({
        where: { id, storeId: user.storeId },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    }

    const product = await this.prisma.product.findUnique({ where });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user: JwtPayload,
  ) {
    // Check if product exists and user has access
    const existingProduct = await this.findOne(id, user);

    // Validate store access for StoreAdmin
    if (
      user.role === AuthRole.STORE_ADMIN &&
      existingProduct.storeId !== user.storeId
    ) {
      throw new ForbiddenException(
        'You can only update products from your store',
      );
    }

    const updateData: any = { ...updateProductDto };

    // Convert price field to Decimal if provided
    if (updateProductDto.price !== undefined) {
      updateData.price = new Prisma.Decimal(updateProductDto.price);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
    });

    return product;
  }

  async remove(id: string, user: JwtPayload) {
    // Check if product exists and user has access
    const existingProduct = await this.findOne(id, user);

    // Validate store access for StoreAdmin
    if (
      user.role === AuthRole.STORE_ADMIN &&
      existingProduct.storeId !== user.storeId
    ) {
      throw new ForbiddenException(
        'You can only delete products from your store',
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  async getActiveProducts(user?: JwtPayload) {
    const where: Prisma.ProductWhereInput = { isActive: true };

    // Filter by store for StoreAdmin and User
    if (user && user.role !== AuthRole.SUPER_ADMIN) {
      where.storeId = user.storeId;
    }

    return this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
