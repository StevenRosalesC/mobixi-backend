import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import {
  SuperAdminLoginDto,
  SuperAdminRegisterDto,
  StoreAdminLoginDto,
  StoreAdminRegisterDto,
  UserLoginDto,
  UserRegisterDto,
  AuthRole,
} from './dto/auth.dto';
import {
  AuthResponseDto,
  SuperAdminResponseDto,
  StoreAdminResponseDto,
  UserResponseDto,
} from './dto/auth-response.dto';
import * as bcrypt from 'bcryptjs';
import { SuperAdmin, StoreAdmin, User, Store } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // SuperAdmin registration (optional, usually seeded)
  async superAdminRegister(
    dto: SuperAdminRegisterDto,
  ): Promise<AuthResponseDto> {
    const existing: SuperAdmin | null = await this.prisma.superAdmin.findUnique(
      {
        where: { email: dto.email },
      },
    );
    if (existing)
      throw new ConflictException('SuperAdmin with this email already exists');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const superAdmin: SuperAdmin = await this.prisma.superAdmin.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    const token = this.jwtService.sign({
      sub: superAdmin.id,
      email: superAdmin.email,
      role: AuthRole.SUPER_ADMIN,
    });
    const superAdminDto: SuperAdminResponseDto = {
      id: superAdmin.id,
      email: superAdmin.email,
      firstName: superAdmin.firstName,
      lastName: superAdmin.lastName,
    };
    return { token, superAdmin: superAdminDto };
  }

  // SuperAdmin login
  async superAdminLogin(dto: SuperAdminLoginDto): Promise<AuthResponseDto> {
    const superAdmin: SuperAdmin | null =
      await this.prisma.superAdmin.findUnique({
        where: { email: dto.email },
      });
    if (!superAdmin) throw new UnauthorizedException('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      superAdmin.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({
      sub: superAdmin.id,
      email: superAdmin.email,
      role: AuthRole.SUPER_ADMIN,
    });
    const superAdminDto: SuperAdminResponseDto = {
      id: superAdmin.id,
      email: superAdmin.email,
      firstName: superAdmin.firstName,
      lastName: superAdmin.lastName,
    };
    return { token, superAdmin: superAdminDto };
  }

  // StoreAdmin registration
  async storeAdminRegister(
    dto: StoreAdminRegisterDto,
  ): Promise<AuthResponseDto> {
    const existing: StoreAdmin | null = await this.prisma.storeAdmin.findUnique(
      {
        where: { email: dto.email },
      },
    );
    if (existing)
      throw new ConflictException('StoreAdmin with this email already exists');
    const store: Store | null = await this.prisma.store.findUnique({
      where: { id: dto.storeId },
    });
    if (!store) throw new NotFoundException('Store not found');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const storeAdmin: StoreAdmin = await this.prisma.storeAdmin.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        storeId: dto.storeId,
      },
    });
    const token = this.jwtService.sign({
      sub: storeAdmin.id,
      email: storeAdmin.email,
      role: AuthRole.STORE_ADMIN,
      storeId: storeAdmin.storeId,
    });
    const storeAdminDto: StoreAdminResponseDto = {
      id: storeAdmin.id,
      email: storeAdmin.email,
      firstName: storeAdmin.firstName,
      lastName: storeAdmin.lastName,
      storeId: storeAdmin.storeId,
    };
    return { token, storeAdmin: storeAdminDto };
  }

  // StoreAdmin login
  async storeAdminLogin(dto: StoreAdminLoginDto): Promise<AuthResponseDto> {
    const storeAdmin: StoreAdmin | null =
      await this.prisma.storeAdmin.findUnique({
        where: { email: dto.email },
      });
    if (!storeAdmin) throw new UnauthorizedException('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      storeAdmin.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({
      sub: storeAdmin.id,
      email: storeAdmin.email,
      role: AuthRole.STORE_ADMIN,
      storeId: storeAdmin.storeId,
    });
    const storeAdminDto: StoreAdminResponseDto = {
      id: storeAdmin.id,
      email: storeAdmin.email,
      firstName: storeAdmin.firstName,
      lastName: storeAdmin.lastName,
      storeId: storeAdmin.storeId,
    };
    return { token, storeAdmin: storeAdminDto };
  }

  // User registration
  async userRegister(dto: UserRegisterDto): Promise<AuthResponseDto> {
    const existing: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing)
      throw new ConflictException('User with this email already exists');
    const store: Store | null = await this.prisma.store.findUnique({
      where: { id: dto.storeId },
    });
    if (!store) throw new NotFoundException('Store not found');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user: User = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        storeId: dto.storeId,
      },
    });
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: AuthRole.USER,
      storeId: user.storeId,
    });
    const userDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      storeId: user.storeId,
    };
    return { token, user: userDto };
  }

  // User login
  async userLogin(dto: UserLoginDto): Promise<AuthResponseDto> {
    const user: User | null = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: AuthRole.USER,
      storeId: user.storeId,
    });
    const userDto: UserResponseDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      storeId: user.storeId,
    };
    return { token, user: userDto };
  }
}
