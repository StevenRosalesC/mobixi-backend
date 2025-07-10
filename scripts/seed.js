const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Create default store
    const store = await prisma.store.upsert({
      where: { id: 'store-123' },
      update: {},
      create: {
        id: 'store-123',
        name: 'Tech Store',
        description: 'Premium electronics store with the latest gadgets',
        address: '123 Main St, City, State 12345',
        phone: '+1-555-0123',
        email: 'contact@techstore.com',
        website: 'https://techstore.com',
        logo: 'https://techstore.com/logo.png',
        isActive: true,
      },
    });
    console.log('✅ Store created:', store.name);

    // Create SUPER_ADMIN
    const superAdminPassword = await bcrypt.hash('password', 10);
    const superAdmin = await prisma.superAdmin.upsert({
      where: { email: 'admin@mobixi.com' },
      update: {},
      create: {
        email: 'admin@mobixi.com',
        password: superAdminPassword,
        firstName: 'Super',
        lastName: 'Admin',
        isActive: true,
        permissions: {
          users: ['create', 'read', 'update', 'delete', 'manage'],
          stores: ['create', 'read', 'update', 'delete', 'manage'],
          products: ['create', 'read', 'update', 'delete', 'manage'],
          subscriptions: ['create', 'read', 'update', 'delete', 'manage'],
          deliveries: ['create', 'read', 'update', 'delete', 'manage'],
          payments: ['create', 'read', 'update', 'delete', 'manage'],
          reports: ['read', 'export', 'manage'],
          settings: ['read', 'update', 'manage'],
        },
      },
    });
    console.log('✅ SUPER_ADMIN created:', superAdmin.email);

    // Create STORE_ADMIN
    const storeAdminPassword = await bcrypt.hash('password123', 10);
    const storeAdmin = await prisma.storeAdmin.upsert({
      where: { email: 'storeadmin@example.com' },
      update: {},
      create: {
        email: 'storeadmin@example.com',
        password: storeAdminPassword,
        firstName: 'Store',
        lastName: 'Admin',
        storeId: 'store-123',
        isActive: true,
        permissions: {
          products: ['create', 'read', 'update', 'delete'],
          users: ['create', 'read', 'update'],
          subscriptions: ['create', 'read', 'update', 'delete'],
          deliveries: ['create', 'read', 'update', 'delete'],
          payments: ['read', 'update'],
          store: ['read', 'update'],
        },
      },
    });
    console.log('✅ STORE_ADMIN created:', storeAdmin.email);

    // Create USER
    const userPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        email: 'user@example.com',
        password: userPassword,
        firstName: 'Regular',
        lastName: 'User',
        storeId: 'store-123',
        isActive: true,
        permissions: {
          subscriptions: ['create', 'read', 'update'],
          deliveries: ['read'],
          payments: ['create', 'read'],
          profile: ['read', 'update'],
        },
      },
    });
    console.log('✅ USER created:', user.email);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Default credentials:');
    console.log('SUPER_ADMIN: admin@mobixi.com / password');
    console.log('STORE_ADMIN: storeadmin@example.com / password123');
    console.log('USER: user@example.com / password123');
    console.log('\n🔗 API Documentation: http://localhost:3001/api');

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed(); 