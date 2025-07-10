import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { EmailsService } from './services/emails.service';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, SuperAdminRegisterDto, StoreAdminRegisterDto } from './dto/auth.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly emailsService: EmailsService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Try to find user in all user types
    let user = await this.prisma.superAdmin.findUnique({
      where: { email },
    });

    let userType = 'SUPER_ADMIN';

    if (!user) {
      user = await this.prisma.storeAdmin.findUnique({
        where: { email },
      });
      userType = 'STORE_ADMIN';
    }

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
      userType = 'USER';
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Inactive user');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: userType,
      permissions: user.permissions,
      storeId: userType !== 'SUPER_ADMIN' ? (user as any).storeId : undefined,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '365d',
    });

    const { password: _, resetToken, ...userWithoutSensitiveData } = user;
    
    return {
      ...userWithoutSensitiveData,
      role: userType,
      token,
    };
  }

  async refresh(user: any) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      storeId: user.storeId,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '365d',
    });

    return {
      ...user,
      token,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    
    // Try to find user in all user types
    let user = await this.prisma.superAdmin.findUnique({ where: { email } });
    let userType = 'SUPER_ADMIN';

    if (!user) {
      user = await this.prisma.storeAdmin.findUnique({ where: { email } });
      userType = 'STORE_ADMIN';
    }

    if (!user) {
      user = await this.prisma.user.findUnique({ where: { email } });
      userType = 'USER';
    }
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = this.jwtService.sign({ email, userType }, { expiresIn: '1h' });
    
    // Update user with reset token
    const updateData = { resetToken: token };
    
    switch (userType) {
      case 'SUPER_ADMIN':
        await this.prisma.superAdmin.update({
          where: { id: user.id },
          data: updateData,
        });
        break;
      case 'STORE_ADMIN':
        await this.prisma.storeAdmin.update({
          where: { id: user.id },
          data: updateData,
        });
        break;
      case 'USER':
        await this.prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });
        break;
    }

    // Send email with token
    const resetUrl = `${process.env.APP_URL}/auth/reset-password/${token}`;
    await this.emailsService.sendPasswordResetEmail(email, resetUrl);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(token);
      const { email, userType } = payload;
      
      // Find user by reset token
      let user;
      switch (userType) {
        case 'SUPER_ADMIN':
          user = await this.prisma.superAdmin.findFirst({ 
            where: { resetToken: token } 
          });
          break;
        case 'STORE_ADMIN':
          user = await this.prisma.storeAdmin.findFirst({ 
            where: { resetToken: token } 
          });
          break;
        case 'USER':
          user = await this.prisma.user.findFirst({ 
            where: { resetToken: token } 
          });
          break;
        default:
          throw new UnauthorizedException('Invalid token');
      }

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
      
      // Update user password and clear reset token
      const updateData = { 
        password: hashedPassword, 
        resetToken: null 
      };
      
      switch (userType) {
        case 'SUPER_ADMIN':
          await this.prisma.superAdmin.update({
            where: { id: user.id },
            data: updateData,
          });
          break;
        case 'STORE_ADMIN':
          await this.prisma.storeAdmin.update({
            where: { id: user.id },
            data: updateData,
          });
          break;
        case 'USER':
          await this.prisma.user.update({
            where: { id: user.id },
            data: updateData,
          });
          break;
      }

      return { message: 'Password updated successfully' };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async registerSuperAdmin(dto: SuperAdminRegisterDto): Promise<AuthResponseDto> {
    // Verificar que no exista el email
    const exists = await this.prisma.superAdmin.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already in use');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const superAdmin = await this.prisma.superAdmin.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        isActive: true,
        permissions: {}, // O asignar permisos por defecto
      },
    });
    return {
      id: superAdmin.id,
      email: superAdmin.email,
      firstName: superAdmin.firstName,
      lastName: superAdmin.lastName,
      role: 'SUPER_ADMIN',
      permissions: superAdmin.permissions,
      token: this.jwtService.sign({
        id: superAdmin.id,
        email: superAdmin.email,
        role: 'SUPER_ADMIN',
        permissions: superAdmin.permissions,
      }),
    };
  }

  async registerStoreAdmin(dto: StoreAdminRegisterDto): Promise<AuthResponseDto> {
    // Verificar que no exista el email
    const exists = await this.prisma.storeAdmin.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already in use');
    // Verificar que el store exista
    const store = await this.prisma.store.findUnique({ where: { id: dto.storeId } });
    if (!store) throw new BadRequestException('Store not found');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const storeAdmin = await this.prisma.storeAdmin.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        isActive: true,
        storeId: dto.storeId,
        permissions: {}, // O asignar permisos por defecto
      },
    });
    return {
      id: storeAdmin.id,
      email: storeAdmin.email,
      firstName: storeAdmin.firstName,
      lastName: storeAdmin.lastName,
      role: 'STORE_ADMIN',
      permissions: storeAdmin.permissions,
      storeId: storeAdmin.storeId,
      token: this.jwtService.sign({
        id: storeAdmin.id,
        email: storeAdmin.email,
        role: 'STORE_ADMIN',
        permissions: storeAdmin.permissions,
        storeId: storeAdmin.storeId,
      }),
    };
  }
}
