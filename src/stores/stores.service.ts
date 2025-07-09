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

  async findAll(): Promise<StoreResponseDto[]> {
    const stores = await this.prisma.store.findMany();
    return stores.map(toStoreResponseDto);
  }

  async findOne(id: string): Promise<StoreResponseDto> {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');
    return toStoreResponseDto(store);
  }

  async update(
    id: string,
    dto: UpdateStoreDto,
    userRole: string,
    userStoreId?: string,
  ): Promise<StoreResponseDto> {
    // Permitir solo a SUPER_ADMIN o al STORE_ADMIN de su propia tienda
    if (userRole !== 'SUPER_ADMIN' && userStoreId !== id) {
      throw new ForbiddenException('You can only update your own store');
    }
    const store = await this.prisma.store.update({ where: { id }, data: dto });
    return toStoreResponseDto(store);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.store.delete({ where: { id } });
  }
}
