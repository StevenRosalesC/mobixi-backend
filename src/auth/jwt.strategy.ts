import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';

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
    // Check if it's an admin or user
    if (payload.type === 'admin') {
      const admin = await this.prisma.admin.findUnique({
        where: { email: payload.email },
      });

      if (!admin) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Unauthorized, admin does not exist',
        });
      }

      if (!admin.isActive) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Unauthorized, admin is inactive',
        });
      }

      return {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        type: 'admin',
        permissions: this.getAdminPermissions(admin.role),
      };
    } else {
      const user = await this.prisma.user.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Unauthorized, user does not exist',
        });
      }

      if (!user.isActive) {
        throw new UnauthorizedException({
          statusCode: 401,
          message: 'Unauthorized, user is inactive',
        });
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: 'USER',
        type: 'user',
        permissions: this.getUserPermissions(),
      };
    }
  }

  private getAdminPermissions(role: string) {
    const permissions = {
      SUPER_ADMIN: {
        products: ['create', 'read', 'update', 'delete'],
        users: ['create', 'read', 'update', 'delete'],
        subscriptions: ['create', 'read', 'update', 'delete'],
        deliveries: ['create', 'read', 'update', 'delete'],
        payments: ['create', 'read', 'update', 'delete'],
        admins: ['create', 'read', 'update', 'delete'],
      },
      ADMIN: {
        products: ['create', 'read', 'update', 'delete'],
        users: ['read', 'update'],
        subscriptions: ['create', 'read', 'update', 'delete'],
        deliveries: ['create', 'read', 'update', 'delete'],
        payments: ['read', 'update'],
      },
      MODERATOR: {
        products: ['read', 'update'],
        users: ['read'],
        subscriptions: ['read', 'update'],
        deliveries: ['read', 'update'],
        payments: ['read'],
      },
    };

    return permissions[role] || {};
  }

  private getUserPermissions() {
    return {
      subscriptions: ['create', 'read', 'update'],
      deliveries: ['read'],
      payments: ['create', 'read'],
    };
  }
}
