import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SuperAdminRegisterGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Check if this is the first SUPER_ADMIN registration
      const existingSuperAdmins = await this.prisma.superAdmin.count();
      
      // If no SUPER_ADMIN exists, allow public access
      if (existingSuperAdmins === 0) {
        console.log('No existing SUPER_ADMINs found, allowing public access');
        return true;
      }
      
      // If SUPER_ADMINs already exist, check if user is authenticated as SUPER_ADMIN
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      
      if (!user) {
        console.log('No user found in request, requiring SUPER_ADMIN authentication');
        throw new ForbiddenException('Only SUPER_ADMIN can create additional SUPER_ADMINs');
      }
      
      if (user.role !== 'SUPER_ADMIN') {
        console.log('User role is not SUPER_ADMIN:', user.role);
        throw new ForbiddenException('Only SUPER_ADMIN can create additional SUPER_ADMINs');
      }
      
      console.log('User is authenticated as SUPER_ADMIN, allowing access');
      return true;
    } catch (error) {
      console.error('Error in SuperAdminRegisterGuard:', error);
      throw error;
    }
  }
} 