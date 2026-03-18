# Bookify Frontend

A modern React-based e-commerce frontend for the Bookify bookstore application.

## Features

- **Authentication**: User registration, login, profile management
- **Book Catalog**: Browse, search, and filter books
- **Shopping Cart**: Add/remove items, quantity management
- **Checkout**: Order placement with shipping information
- **Order Management**: View order history and track orders
- **Admin Dashboard**: Book management, order processing, analytics
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- Backend API running on `http://localhost:3000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
|-- components/          # Reusable UI components
|   |-- ui/             # shadcn/ui components
|   |-- BookCard.tsx    # Book display card
|   |-- StickyHeader.tsx # Navigation header
|   |-- ProtectedRoute.tsx # Auth wrapper
|-- hooks/              # Custom React hooks
|   |-- useAuth.ts      # Authentication logic
|   |-- useBooks.ts     # Book operations
|   |-- useCart.ts      # Cart management
|   |-- useOrders.ts    # Order operations
|   |-- useCategories.ts # Category operations
|-- lib/                # Services and utilities
|   |-- api.ts          # API client and schemas
|   |-- auth.ts         # Auth service
|   |-- books.ts        # Book service
|   |-- cart.ts         # Cart service
|   |-- orders.ts       # Order service
|   |-- categories.ts   # Category service
|-- pages/              # Page components
|   |-- Index.tsx       # Home page
|   |-- Login.tsx       # Login page
|   |-- Register.tsx    # Registration page
|   |-- BookDetail.tsx  # Book details
|   |-- Cart.tsx        # Shopping cart
|   |-- Checkout.tsx    # Checkout process
|   |-- Orders.tsx      # Order history
|   |-- Profile.tsx     # User profile
|   |-- AdminDashboard.tsx # Admin interface
```

## API Integration

The frontend connects to the Bookify backend API at `http://localhost:3000/api`. Key endpoints:

- **Auth**: `/auth/login`, `/auth/register`
- **Books**: `/books`, `/books/:id`, `/books/search`
- **Cart**: `/cart`, `/cart/items`
- **Orders**: `/orders`, `/orders/my`
- **Categories**: `/categories`
- **Analytics**: `/analytics` (admin only)

## Authentication Flow

1. Users register/login via JWT tokens
2. Tokens stored in localStorage
3. Protected routes require authentication
4. Admin routes require ADMIN role

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

## Key Components

### Authentication
- `useAuth` hook manages user state
- `ProtectedRoute` component guards routes
- Token-based authentication with auto-refresh

### Data Fetching
- TanStack Query for caching and synchronization
- Custom hooks for each entity (books, cart, orders)
- Optimistic updates for better UX

### Forms
- React Hook Form with Zod validation
- Type-safe form handling
- Error handling and loading states

### Styling
- Tailwind CSS for utility-first styling
- shadcn/ui for consistent components
- Dark/light theme support

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

3. Update `VITE_API_URL` to point to your production backend

## Contributing

1. Follow the existing code patterns
2. Use TypeScript for all new code
3. Add proper error handling
4. Test on mobile devices
5. Update documentation as needed

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure backend allows frontend origin
2. **Authentication failures**: Check token storage and API URL
3. **Build errors**: Verify all dependencies are installed
4. **Routing issues**: Ensure React Router is properly configured

### Debug Mode

Enable debug logging by setting `VITE_ENV=development` in your environment.
