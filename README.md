# Bookify

A full-stack e-commerce bookstore application — customers can browse, search, and purchase books while admins manage inventory, orders, and analytics through a dedicated dashboard.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, React Router v6, TanStack Query v5 |
| **UI** | Tailwind CSS, shadcn/ui (Radix UI), Lucide React, Recharts, Sonner |
| **Backend** | Node.js, Express, TypeScript |
| **ORM** | Drizzle ORM |
| **Database** | PostgreSQL (Supabase) |
| **Auth** | JWT + bcrypt |
| **Validation** | Zod |
| **Testing** | Vitest, React Testing Library, Playwright |

---

## Project Structure

```
Bookify/
├── backend/          # Express API server
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── db/           # Drizzle schema, migrations, seed
│       ├── domain/
│       ├── dto/
│       ├── middlewares/
│       ├── patterns/     # Observer, Factory, Strategy, etc.
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── utils/
└── frontend/         # React SPA
    └── src/
        ├── components/
        ├── hooks/
        ├── lib/
        └── pages/
```

---

## Features

### Customer
- JWT-based registration, login, profile management
- Browse/search/filter books by category, price, author, year
- Persistent shopping cart with stock validation
- Checkout with shipping address, order confirmation
- Order history and real-time status tracking
- In-app notifications

### Admin
- Sales analytics dashboard (revenue, orders, bestsellers, trends)
- Full book CRUD — create, update, delete, manage stock
- Category management
- Order management — update status (`Pending → Processing → Shipped → Delivered`), cancel orders
- Low-stock alerts

---

## API Routes

| Prefix | Resource |
|---|---|
| `/api/auth` | Register, login |
| `/api/users` | Profile, password |
| `/api/books` | Catalog, search, CRUD |
| `/api/categories` | Category listing & management |
| `/api/cart` | Cart CRUD |
| `/api/orders` | Place & manage orders |
| `/api/notifications` | User notifications |
| `/api/analytics` | Admin analytics & reports |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- PostgreSQL database (or a [Supabase](https://supabase.com) project)

---

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment** — create `backend/.env`:
   ```env
   DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
   JWT_SECRET=your_jwt_secret
   PORT=3000
   NODE_ENV=development
   ```

3. **Run database migrations**
   ```bash
   npm run db:push
   ```

4. **(Optional) Seed sample data**
   ```bash
   npm run seed
   ```

5. **Start the dev server**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:3000`. Health check: `GET /health`

---

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment** — create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`

---

## Database Management (Drizzle)

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Push schema directly (dev shortcut)
npm run db:push

# Open Drizzle Studio (visual DB browser)
npm run db:studio
```

---

## Scripts

### Backend

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled output |
| `npm run seed` | Seed the database |

### Frontend

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests (Vitest) |
| `npm run lint` | ESLint |

---

## Architecture

The backend follows **Clean Architecture** with strict layer separation:

```
Routes → Controllers → Services → Repositories → Database
```

**Design Patterns applied:**
- **Observer** — Order status change notifications
- **Repository** — Data access abstraction (Drizzle implementations)
- **Singleton** — Database connection pool
- **Strategy** — Pricing / discount strategies
- **Factory** — Order types and user roles
- **State** — Order lifecycle management
- **Chain of Responsibility** — Order validation pipeline
- **Decorator** — Order feature extensions

---

## Database Schema

Core entities: `users`, `books`, `categories`, `carts`, `cart_items`, `orders`, `order_items`, `notifications`, `sales_reports`, `audit_logs`

- All primary keys are UUIDs
- `order_items.price_at_purchase` snapshots book price at the time of purchase
- Cart is 1:1 per user and persists across sessions
- Order status transitions are enforced at the service layer

See [`ErDiagram.md`](./ErDiagram.md) for the full ER diagram.

---

## User Roles

| Role | Access |
|---|---|
| **Customer** | Browse, cart, checkout, orders, profile, notifications |
| **Admin** | All customer access + inventory management, order fulfillment, analytics |
