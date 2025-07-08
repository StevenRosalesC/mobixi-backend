# Mobixi Backend

Backend for a "surprise box" subscription platform.

## Features

- JWT Authentication for users and administrators
- Product Management (physical, digital, hybrid)
- Subscription System with recurring deliveries
- Admin Panel to manage users, products and subscriptions
- Delivery and Payment History
- RESTful API with data validation
- PostgreSQL Database with Prisma ORM

## Quick Start

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment**

```bash
cp .env.example .env
```

3. **Setup database**

```bash
npx prisma db push
npx prisma generate
```

4. **Run development server**

```bash
npm run start:dev
```

## Scripts

```bash
npm run start          # Start in production
npm run start:dev      # Start in development
npm run build          # Compile TypeScript
npm run test           # Run tests
```

## Database

See `database/README.md` for database setup and structure.

## License

MIT
