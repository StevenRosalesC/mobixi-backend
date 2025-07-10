import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRoleGuard } from './guards/user-role.guard';
import { PermissionGuard } from './guards/permission.guard';
import { SuperAdminRegisterGuard } from './guards/super-admin-register.guard';
import { EmailsService } from './services/emails.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '365d' },
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAIL_HOST,
          port: parseInt(process.env.MAIL_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        },
        defaults: {
          from: process.env.MAIL_FROM,
        },
      }),
    }),
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    UserRoleGuard, 
    PermissionGuard,
    SuperAdminRegisterGuard,
    EmailsService,
    PrismaService,
  ],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
