# Mobixi Backend API

A comprehensive NestJS backend system for managing stores, products, subscriptions, deliveries, and payments with role-based access control (RBAC) and JWT authentication.

## 🚀 Features

- **JWT Authentication** with refresh tokens
- **Role-Based Access Control (RBAC)** with granular permissions
- **Multi-store support** with store-specific data isolation
- **Password recovery** with email notifications
- **Comprehensive API documentation** with Swagger
- **Database integration** with Prisma ORM
- **Email service** for notifications
- **Input validation** and error handling

## 🏗️ Architecture

### User Roles

- **SUPER_ADMIN**: Full access to all modules and stores
- **STORE_ADMIN**: Access to their assigned store and related modules
- **USER**: Limited access to subscriptions, deliveries, and payments within their store

### Modules

- **Authentication**: Login, token refresh, password reset
- **Stores**: Store management (SUPER_ADMIN only)
- **Products**: Product catalog management
- **Subscriptions**: Subscription management
- **Deliveries**: Delivery tracking and management
- **Payments**: Payment processing and history

### Permissions

Each role has specific permissions for different modules:

- **CREATE**: Create new resources
- **READ**: View resources
- **UPDATE**: Modify existing resources
- **DELETE**: Remove resources
- **MANAGE**: Full administrative access

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- SMTP server for email notifications

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mobixi-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment configuration**
   Create a `.env` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/mobixi_db"

   # JWT Configuration
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
   JWT_EXPIRES_IN="24h"
   JWT_REFRESH_EXPIRES_IN="7d"

   # Email Configuration
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your-email@gmail.com
   MAIL_PASS=your-app-password
   MAIL_FROM=noreply@mobixi.com

   # Application
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

4. **Database setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Or apply the manual SQL script if migrations fail
   # (See database/update_auth_fields.sql)

   # Create default users (SUPER_ADMIN, STORE_ADMIN, USER)
   npm run seed

   # Or run this SQL script manually in your database:
   # database/seed-super-admin.sql
   ```

5. **Start the application**

   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## 📚 API Documentation

Once the application is running, you can access the interactive API documentation at:

```
http://localhost:3001/api
```

The documentation includes:

- Complete endpoint descriptions
- Request/response examples
- Authentication requirements
- Error response schemas
- Interactive testing interface

## 🔐 Authentication

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@mobixi.com",
  "password": "password"
}
```

### Register SUPER_ADMIN (Protected - Only SUPER_ADMIN can access)

```http
POST /auth/register/super-admin
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "email": "superadmin2@mobixi.com",
  "password": "superadmin123",
  "firstName": "Super",
  "lastName": "Admin2"
}
```

### Register STORE_ADMIN (Protected - Only SUPER_ADMIN can access)

```http
POST /auth/register/store-admin
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "email": "admin@tienda.com",
  "password": "admin123",
  "firstName": "Admin",
  "lastName": "Tienda",
  "storeId": "store-123"
}
```

### Response

```json
{
  "id": "uuid",
  "email": "admin@mobixi.com",
  "firstName": "Super",
  "lastName": "Admin",
  "role": "SUPER_ADMIN",
  "permissions": {
    "users": ["create", "read", "update", "delete", "manage"],
    "stores": ["create", "read", "update", "delete", "manage"],
    "products": ["create", "read", "update", "delete", "manage"],
    "subscriptions": ["create", "read", "update", "delete", "manage"],
    "deliveries": ["create", "read", "update", "delete", "manage"],
    "payments": ["create", "read", "update", "delete", "manage"],
    "reports": ["read", "export", "manage"],
    "settings": ["read", "update", "manage"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Using JWT Token

Include the token in the Authorization header for protected endpoints:

```http
Authorization: Bearer <your-jwt-token>
```

## 👥 Default Users

The system includes default users for testing:

### Super Admin

- **Email**: admin@mobixi.com
- **Password**: password
- **Role**: SUPER_ADMIN
- **Permissions**: Full access to all modules

### Store Admin

- **Email**: storeadmin@example.com
- **Password**: password123
- **Role**: STORE_ADMIN
- **Store**: store-123
- **Permissions**: Limited to their store

### Regular User

- **Email**: user@example.com
- **Password**: password123
- **Role**: USER
- **Store**: store-123
- **Permissions**: Basic access to subscriptions, deliveries, payments

## 🏪 Store Management

### Create Store (SUPER_ADMIN only)

```http
POST /stores
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Tech Store",
  "description": "Premium electronics store",
  "address": "123 Main St, City, State 12345",
  "phone": "+1-555-0123",
  "email": "contact@techstore.com",
  "website": "https://techstore.com",
  "isActive": true
}
```

## 📦 Product Management

### Create Product (STORE_ADMIN/SUPER_ADMIN)

```http
POST /products
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced camera features",
  "price": 99900,
  "category": "electronics",
  "type": "PHYSICAL",
  "stock": 50,
  "sku": "IPH15PRO-128GB-BLACK",
  "weight": 187,
  "dimensions": "147.7 x 71.5 x 7.85 mm"
}
```

### List Products

```http
GET /products?search=iphone&category=electronics&type=PHYSICAL&page=1&limit=10
Authorization: Bearer <jwt-token>
```

## 📋 Subscription Management

### Create Subscription

```http
POST /subscriptions
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "productId": "product-uuid",
  "userId": "user-uuid",
  "startDate": "2024-01-15",
  "endDate": "2024-02-15",
  "status": "ACTIVE",
  "billingCycle": "MONTHLY"
}
```

## 🚚 Delivery Management

### Create Delivery

```http
POST /deliveries
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "subscriptionId": "subscription-uuid",
  "address": "123 Delivery St, City, State 12345",
  "scheduledDate": "2024-01-20",
  "status": "SCHEDULED"
}
```

## 💳 Payment Management

### Create Payment

```http
POST /payments
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "subscriptionId": "subscription-uuid",
  "amount": 99900,
  "method": "CREDIT_CARD",
  "status": "PENDING"
}
```

## 🔧 Development

### Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── decorators/      # Custom decorators
│   ├── guards/          # Authentication guards
│   ├── dto/             # Data transfer objects
│   ├── interfaces/      # Type definitions
│   └── jwt.strategy.ts  # JWT strategy
├── stores/              # Store management
├── products/            # Product catalog
├── subscriptions/       # Subscription management
├── deliveries/          # Delivery tracking
├── payments/            # Payment processing
├── prisma/              # Database service
└── config/              # Configuration
```

### Available Scripts

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Testing
npm run test
npm run test:e2e

# Database
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

### Environment Variables

| Variable                 | Description                  | Default               |
| ------------------------ | ---------------------------- | --------------------- |
| `DATABASE_URL`           | PostgreSQL connection string | -                     |
| `JWT_SECRET`             | JWT signing secret           | -                     |
| `JWT_REFRESH_SECRET`     | JWT refresh secret           | -                     |
| `JWT_EXPIRES_IN`         | JWT expiration time          | 24h                   |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration     | 7d                    |
| `MAIL_HOST`              | SMTP host                    | -                     |
| `MAIL_PORT`              | SMTP port                    | 587                   |
| `MAIL_USER`              | SMTP username                | -                     |
| `MAIL_PASS`              | SMTP password                | -                     |
| `MAIL_FROM`              | From email address           | -                     |
| `PORT`                   | Application port             | 3001                  |
| `FRONTEND_URL`           | Frontend URL for CORS        | http://localhost:3000 |

## 🧪 Testing

### Manual Testing

1. **Start the application**

   ```bash
   npm run start:dev
   ```

2. **Access Swagger documentation**

   ```
   http://localhost:3001/api
   ```

3. **Test authentication**
   - Use the login endpoint with default credentials
   - Copy the JWT token from the response
   - Use the "Authorize" button in Swagger to set the token

4. **Test endpoints**
   - Try different endpoints based on user role
   - Verify permissions are working correctly
   - Test error scenarios

### Automated Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🔒 Security

### JWT Security

- Tokens expire after 24 hours
- Refresh tokens expire after 7 days
- Secure token storage recommended

### Role-Based Access

- Granular permissions per module
- Store-specific data isolation
- Input validation on all endpoints

### Database Security

- Parameterized queries via Prisma
- No SQL injection vulnerabilities
- Proper error handling

## 📝 Error Handling

The API returns standardized error responses:

```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

Common error codes:

- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Invalid or missing JWT token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server-side error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For technical support or questions:

- Check the API documentation at `/api`
- Review the error logs
- Contact the development team

---

**Mobixi Backend API** - A robust and scalable backend solution for multi-store management systems.
