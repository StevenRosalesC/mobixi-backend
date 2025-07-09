import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PermissionGuard } from './guards/permission.guard';
import { UserRoleGuard } from './guards/user-role.guard';
import { StoreRequiredGuard } from './guards/store-required.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PermissionGuard,
    UserRoleGuard,
    StoreRequiredGuard,
  ],
  exports: [AuthService, PermissionGuard, UserRoleGuard, StoreRequiredGuard],
})
export class AuthModule {}
