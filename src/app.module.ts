import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          port: parseInt(process.env.PORT || '3000', 10),
          database: {
            url: process.env.DATABASE_URL,
          },
          jwt: {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
          },
          app: {
            name: process.env.APP_NAME || 'Mobixi Backend',
            version: process.env.APP_VERSION || '1.0.0',
          },
        }),
      ],
    }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    SubscriptionsModule,
    DeliveriesModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
