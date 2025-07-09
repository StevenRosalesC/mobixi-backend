import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';
import { AuthRole } from './dto/auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const { sub, email, role, storeId } = payload;

    // Validate based on role
    switch (role) {
      case AuthRole.SUPER_ADMIN:
        return await this.validateSuperAdmin(email);

      case AuthRole.STORE_ADMIN:
        return await this.validateStoreAdmin(email, storeId);

      case AuthRole.USER:
        return await this.validateUser(email, storeId);

      default:
        throw new UnauthorizedException('Invalid role');
    }
  }

  private async validateSuperAdmin(email: string) {
    const superAdmin = await this.prisma.superAdmin.findUnique({
      where: { email },
    });

    if (!superAdmin) {
      throw new UnauthorizedException('SuperAdmin not found');
    }

    if (!superAdmin.isActive) {
      throw new UnauthorizedException('SuperAdmin is inactive');
    }

    return {
      id: superAdmin.id,
      email: superAdmin.email,
      firstName: superAdmin.firstName,
      lastName: superAdmin.lastName,
      role: AuthRole.SUPER_ADMIN,
      permissions: this.getSuperAdminPermissions(),
    };
  }

  private async validateStoreAdmin(email: string, storeId?: string) {
    const storeAdmin = await this.prisma.storeAdmin.findUnique({
      where: { email },
      include: { store: true },
    });

    if (!storeAdmin) {
      throw new UnauthorizedException('StoreAdmin not found');
    }

    if (!storeAdmin.isActive) {
      throw new UnauthorizedException('StoreAdmin is inactive');
    }

    if (storeId && storeAdmin.storeId !== storeId) {
      throw new UnauthorizedException(
        'StoreAdmin does not belong to this store',
      );
    }

    return {
      id: storeAdmin.id,
      email: storeAdmin.email,
      firstName: storeAdmin.firstName,
      lastName: storeAdmin.lastName,
      role: AuthRole.STORE_ADMIN,
      storeId: storeAdmin.storeId,
      store: storeAdmin.store,
      permissions: this.getStoreAdminPermissions(),
    };
  }

  private async validateUser(email: string, storeId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { store: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive');
    }

    if (storeId && user.storeId !== storeId) {
      throw new UnauthorizedException('User does not belong to this store');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: AuthRole.USER,
      storeId: user.storeId,
      store: user.store,
      permissions: this.getUserPermissions(),
    };
  }

  private getSuperAdminPermissions() {
    return {
      stores: ['create', 'read', 'update', 'delete'],
      storeAdmins: ['create', 'read', 'update', 'delete'],
      products: ['create', 'read', 'update', 'delete'],
      users: ['create', 'read', 'update', 'delete'],
      subscriptions: ['create', 'read', 'update', 'delete'],
      deliveries: ['create', 'read', 'update', 'delete'],
      payments: ['create', 'read', 'update', 'delete'],
      superAdmins: ['create', 'read', 'update', 'delete'],
    };
  }

  private getStoreAdminPermissions() {
    return {
      products: ['create', 'read', 'update', 'delete'],
      users: ['create', 'read', 'update'],
      subscriptions: ['create', 'read', 'update', 'delete'],
      deliveries: ['create', 'read', 'update', 'delete'],
      payments: ['read', 'update'],
      store: ['read', 'update'],
    };
  }

  private getUserPermissions() {
    return {
      subscriptions: ['create', 'read', 'update'],
      deliveries: ['read'],
      payments: ['create', 'read'],
      profile: ['read', 'update'],
    };
  }
}
