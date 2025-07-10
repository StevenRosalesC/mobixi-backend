import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    // Check if user exists based on role
    let user;
    
    switch (payload.role) {
      case 'SUPER_ADMIN':
        user = await this.prisma.superAdmin.findUnique({
          where: { email: payload.email },
        });
        break;
      case 'STORE_ADMIN':
        user = await this.prisma.storeAdmin.findUnique({
          where: { email: payload.email },
        });
        break;
      case 'USER':
        user = await this.prisma.user.findUnique({
          where: { email: payload.email },
        });
        break;
      default:
        throw new UnauthorizedException('Invalid user role');
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Inactive user');
    }

    const { password, resetToken, ...userWithoutSensitiveData } = user;
    return {
      ...userWithoutSensitiveData,
      role: payload.role,
      permissions: payload.permissions,
    };
  }
} 