# Bookify Backend

RESTful API for Bookify — a full-stack e-commerce bookstore.

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL (Supabase)
- **Auth:** JWT + bcrypt
- **Validation:** Zod

## Architecture

Clean Architecture with OOP principles:

```
src/
├── config/         # Database singleton
├── db/
│   ├── schema/     # Drizzle ORM table definitions
│   └── seed.ts     # Database seeder
├── domain/         # Domain models & enums
├── dto/            # Zod-validated DTOs
├── repositories/
│   ├── interfaces/ # Repository contracts
│   └── implementations/ # Drizzle implementations
├── patterns/
│   ├── strategy/   # Search strategy
│   ├── chain/      # Order validation chain
│   ├── observer/   # Notification observer
│   └── factory/    # User factory
├── services/       # Business logic layer
├── middlewares/    # Auth, validation, error handling
├── controllers/    # Request handlers
└── routes/         # Express routers
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in `.env`:

```
DATABASE_URL=postgresql://postgres:<password>@<host>:<port>/<db>
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
LOW_STOCK_THRESHOLD=5
```

### 3. Push schema to Supabase

```bash
npm run db:push
```

### 4. Seed the database

```bash
npm run db:seed
```

Default seed credentials:
- Admin: `admin@bookify.com` / `Admin@1234`
- Customer: `customer@bookify.com` / `Customer@1234`

### 5. Start the server

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/users/me` | Customer | Get profile |
| PATCH | `/api/users/me` | Customer | Update profile |
| PATCH | `/api/users/me/password` | Customer | Change password |
| GET | `/api/books` | — | List books (paginated, filtered) |
| GET | `/api/books/search?q=` | — | Search books |
| GET | `/api/books/:id` | — | Get book |
| POST | `/api/books` | Admin | Create book |
| PATCH | `/api/books/:id` | Admin | Update book |
| DELETE | `/api/books/:id` | Admin | Delete book |
| GET | `/api/categories` | — | List categories |
| POST | `/api/categories` | Admin | Create category |
| PATCH | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |
| GET | `/api/cart` | Customer | View cart |
| POST | `/api/cart/items` | Customer | Add to cart |
| PATCH | `/api/cart/items/:itemId` | Customer | Update quantity |
| DELETE | `/api/cart/items/:itemId` | Customer | Remove item |
| DELETE | `/api/cart` | Customer | Clear cart |
| POST | `/api/orders` | Customer | Place order |
| GET | `/api/orders/my` | Customer | My orders |
| GET | `/api/orders/:id` | Customer/Admin | Get order |
| POST | `/api/orders/:id/cancel` | Customer/Admin | Cancel order |
| GET | `/api/orders` | Admin | All orders |
| PATCH | `/api/orders/:id/status` | Admin | Update status |
| GET | `/api/notifications` | Customer | My notifications |
| PATCH | `/api/notifications/:id/read` | Customer | Mark read |
| PATCH | `/api/notifications/read-all` | Customer | Mark all read |
| GET | `/api/analytics/dashboard` | Admin | Dashboard stats |
| GET | `/api/analytics/sales-report` | Admin | Sales report |
| GET | `/api/analytics/top-books` | Admin | Top selling books |
| GET | `/api/analytics/low-stock` | Admin | Low stock books |
| PATCH | `/api/analytics/inventory/:bookId` | Admin | Update stock |

## Design Patterns

- **Strategy** — Pluggable book search (title/author/full-text)
- **Chain of Responsibility** — Order validation pipeline
- **Observer** — Notification event system
- **Factory** — User object creation
- **Singleton** — Database connection
