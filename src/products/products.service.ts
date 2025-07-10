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
    if (user.role === AuthRole.STORE_ADMIN) {
      if (!user.storeIds || !user.storeIds.includes(createProductDto.storeId)) {
        throw new ForbiddenException(
          'You can only create products for your assigned stores',
        );
      }
    }

    const product = await this.prisma.product.create({
      data: {
        storeId: createProductDto.storeId,
        name: createProductDto.name,
        description: createProductDto.description,
        price: new Prisma.Decimal(createProductDto.price),
        category: createProductDto.category,
        type: createProductDto.type,
        image: createProductDto.imageUrl,
        isActive: createProductDto.isActive,
      },
    });

    return product;
  }

  async findAll(query: ProductQueryDto, user?: JwtPayload) {
    // Convertir page y limit a number, isActive a boolean
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const isActive = query.isActive !== undefined ? query.isActive === 'true' : undefined;
    const { search, category, type } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    // Filter by store for StoreAdmin and User
    if (user && user.role !== AuthRole.SUPER_ADMIN) {
      if (user.role === AuthRole.STORE_ADMIN) {
        where.storeId = { in: user.storeIds || [] };
      } else if (user.role === AuthRole.USER) {
        where.storeId = user.storeId;
      }
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
      let storeFilter: Prisma.ProductWhereInput;
      
      if (user.role === AuthRole.STORE_ADMIN) {
        storeFilter = { storeId: { in: user.storeIds || [] } };
      } else if (user.role === AuthRole.USER) {
        storeFilter = { storeId: user.storeId };
      }

      const product = await this.prisma.product.findFirst({
        where: { id, ...storeFilter },
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
    if (user.role === AuthRole.STORE_ADMIN) {
      if (!user.storeIds || !user.storeIds.includes(existingProduct.storeId)) {
        throw new ForbiddenException(
          'You can only update products from your assigned stores',
        );
      }
    }

    const updateData: any = { ...updateProductDto };

    // Convert price field to Decimal if provided
    if (updateProductDto.price !== undefined) {
      updateData.price = new Prisma.Decimal(updateProductDto.price);
    }

    // Map imageUrl to image field
    if (updateProductDto.imageUrl !== undefined) {
      updateData.image = updateProductDto.imageUrl;
      delete updateData.imageUrl;
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
    if (user.role === AuthRole.STORE_ADMIN) {
      if (!user.storeIds || !user.storeIds.includes(existingProduct.storeId)) {
        throw new ForbiddenException(
          'You can only delete products from your assigned stores',
        );
      }
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
      if (user.role === AuthRole.STORE_ADMIN) {
        where.storeId = { in: user.storeIds || [] };
      } else if (user.role === AuthRole.USER) {
        where.storeId = user.storeId;
      }
    }

    return this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }
}
