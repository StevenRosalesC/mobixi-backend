import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateStoreDto,
  UpdateStoreDto,
  StoreResponseDto,
} from './dto/store.dto';
import { Store } from '@prisma/client';

function toStoreResponseDto(store: Store): StoreResponseDto {
  return {
    id: store.id,
    name: store.name,
    address: store.address ?? undefined,
    logo: (store as any).logo ?? undefined,
    isActive: store.isActive,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
}

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStoreDto): Promise<StoreResponseDto> {
    const store = await this.prisma.store.create({ data: dto });
    return toStoreResponseDto(store);
  }

  async findAll(userRole: string, userStoreIds?: string[]): Promise<StoreResponseDto[]> {
    // SUPER_ADMIN can see all stores
    if (userRole === 'SUPER_ADMIN') {
      const stores = await this.prisma.store.findMany();
      return stores.map(toStoreResponseDto);
    }

    // STORE_ADMIN can only see their assigned stores
    if (userRole === 'STORE_ADMIN' && userStoreIds && userStoreIds.length > 0) {
      const stores = await this.prisma.store.findMany({
        where: { id: { in: userStoreIds } }
      });
      return stores.map(toStoreResponseDto);
    }

    return [];
  }

  async findOne(id: string, userRole: string, userStoreIds?: string[]): Promise<StoreResponseDto> {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');

    // SUPER_ADMIN can access any store
    if (userRole === 'SUPER_ADMIN') {
      return toStoreResponseDto(store);
    }

    // STORE_ADMIN can only access their assigned stores
    if (userRole === 'STORE_ADMIN') {
      if (!userStoreIds || !userStoreIds.includes(id)) {
        throw new ForbiddenException('You can only access your assigned stores');
      }
      return toStoreResponseDto(store);
    }

    throw new ForbiddenException('Access denied');
  }

  async update(
    id: string,
    dto: UpdateStoreDto,
    userRole: string,
    userStoreIds?: string[],
  ): Promise<StoreResponseDto> {
    // SUPER_ADMIN can update any store
    if (userRole === 'SUPER_ADMIN') {
      const store = await this.prisma.store.update({ where: { id }, data: dto });
      return toStoreResponseDto(store);
    }

    // STORE_ADMIN can only update their assigned stores
    if (userRole === 'STORE_ADMIN') {
      if (!userStoreIds || !userStoreIds.includes(id)) {
        throw new ForbiddenException('You can only update your assigned stores');
      }
      const store = await this.prisma.store.update({ where: { id }, data: dto });
      return toStoreResponseDto(store);
    }

    throw new ForbiddenException('Access denied');
  }

  async remove(id: string, userRole: string, userStoreIds?: string[]): Promise<void> {
    // SUPER_ADMIN can delete any store
    if (userRole === 'SUPER_ADMIN') {
      await this.prisma.store.delete({ where: { id } });
      return;
    }

    // STORE_ADMIN can only delete their assigned stores
    if (userRole === 'STORE_ADMIN') {
      if (!userStoreIds || !userStoreIds.includes(id)) {
        throw new ForbiddenException('You can only delete your assigned stores');
      }
      await this.prisma.store.delete({ where: { id } });
      return;
    }

    throw new ForbiddenException('Access denied');
  }
}
