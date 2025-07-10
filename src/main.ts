import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Mobixi Backend API')
    .setDescription(`
      # Mobixi Backend API Documentation

      This API provides a comprehensive backend system for managing stores, products, subscriptions, deliveries, and payments with role-based access control.

      ## Authentication

      The API uses JWT (JSON Web Tokens) for authentication. Most endpoints require a valid JWT token in the Authorization header:

      \`\`\`
      Authorization: Bearer <your-jwt-token>
      \`\`\`

      ## User Roles

      - **SUPER_ADMIN**: Full access to all modules and stores
      - **STORE_ADMIN**: Access to their assigned store and related modules
      - **USER**: Limited access to subscriptions, deliveries, and payments within their store

      ## Permissions

      Each role has specific permissions for different modules:
      - **CREATE**: Create new resources
      - **READ**: View resources
      - **UPDATE**: Modify existing resources
      - **DELETE**: Remove resources
      - **MANAGE**: Full administrative access

      ## Modules

      - **Authentication**: Login, token refresh, password reset
      - **Stores**: Store management (SUPER_ADMIN only)
      - **Products**: Product catalog management
      - **Subscriptions**: Subscription management
      - **Deliveries**: Delivery tracking and management
      - **Payments**: Payment processing and history

      ## Error Responses

      The API returns standardized error responses:
      - **400**: Bad Request - Invalid input data
      - **401**: Unauthorized - Invalid or missing JWT token
      - **403**: Forbidden - Insufficient permissions
      - **404**: Not Found - Resource not found
      - **500**: Internal Server Error - Server-side error

      ## Rate Limiting

      API endpoints are rate-limited to prevent abuse. Please respect the rate limits.

      ## Support

      For technical support, contact the development team.
    `)
    .setVersion('1.0.0')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Stores', 'Store management endpoints')
    .addTag('Products', 'Product catalog management endpoints')
    .addTag('Subscriptions', 'Subscription management endpoints')
    .addTag('Deliveries', 'Delivery tracking and management endpoints')
    .addTag('Payments', 'Payment processing and history endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for references
    )
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.mobixi.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Custom Swagger UI options
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai',
      },
    },
    customSiteTitle: 'Mobixi API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; font-size: 36px; }
      .swagger-ui .info .description { font-size: 16px; line-height: 1.6; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 8px; }
      .swagger-ui .auth-wrapper { background: #e8f5e8; padding: 15px; border-radius: 6px; }
    `,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api`);
  console.log(`🔐 Authentication endpoints: http://localhost:${port}/auth`);
  console.log(`🏪 Stores endpoints: http://localhost:${port}/stores`);
  console.log(`📦 Products endpoints: http://localhost:${port}/products`);
  console.log(`📋 Subscriptions endpoints: http://localhost:${port}/subscriptions`);
  console.log(`🚚 Deliveries endpoints: http://localhost:${port}/deliveries`);
  console.log(`💳 Payments endpoints: http://localhost:${port}/payments`);
}
bootstrap();
