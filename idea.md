# Bookify

## Overview

**Bookify** is a full-stack e-commerce web application designed for a modern bookstore. It provides customers with an intuitive shopping experience to browse, search, and purchase books online, while empowering store administrators with powerful inventory and order management tools. The platform features real-time inventory tracking, secure authentication, advanced search capabilities, and a comprehensive admin dashboard.

Traditional bookstores struggle with online presence and inventory management. **Bookify** bridges this gap by offering a seamless digital storefront that integrates catalog browsing, shopping cart management, secure checkout, and order fulfillment — all backed by role-based access control and real-time data synchronization.

---

## Problem Statement

1. **Limited online visibility** — Small bookstores lack modern e-commerce platforms to reach digital customers.
2. **Manual inventory management** — Tracking stock levels, updating prices, and managing categories is time-consuming without proper tools.
3. **Poor customer experience** — Customers need easy search, filtering, and secure checkout processes.
4. **Order tracking challenges** — Both customers and admins need transparent order status tracking.
5. **No sales analytics** — Store owners lack insights into sales trends, popular books, and revenue metrics.

---

## Scope

### In Scope
- Customer-facing e-commerce storefront
- User authentication and authorization (Customer, Admin roles)
- Book catalog with categories, authors, and detailed metadata
- Advanced search and filtering system
- Shopping cart with real-time price calculation
- Secure checkout process with shipping details
- Order management system with status tracking
- Admin dashboard with sales analytics
- Inventory management (CRUD operations for books and categories)
- Order fulfillment workflow (Pending → Processing → Shipped → Delivered)
- User profile management
- Responsive design for desktop and mobile

### Out of Scope (for Milestone 1)
- Real payment gateway integration (simulated payments only)
- Email notifications for order confirmations
- Reviews and ratings system
- Wishlist functionality
- Advanced recommendation engine
- Multi-vendor support
- Mobile native application

---

## Key Features

### 🛒 Customer Features

#### 1. Authentication & User Management
- **Registration**: Create account with email, password, and shipping address.
- **Login/Logout**: Secure JWT-based authentication.
- **Profile Management**: Update personal info and default shipping address.
- **Password Management**: Change password with validation.

#### 2. Product Discovery
- **Browse Catalog**: View all books with pagination.
- **Category Filtering**: Filter books by genre/category.
- **Search**: Full-text search by title, author, or ISBN.
- **Advanced Filtering**: Filter by price range, author, publication year.
- **Book Details**: View detailed book info (description, author, price, stock, cover image).
- **Sort Options**: Sort by price (low-high, high-low), newest arrivals, bestsellers.

#### 3. Shopping Cart
- **Add to Cart**: Add books with quantity selection.
- **Update Quantity**: Increase/decrease item quantities.
- **Remove Items**: Remove individual items from cart.
- **Real-time Total**: Automatic price calculation with quantity updates.
- **Stock Validation**: Prevent adding more than available stock.
- **Persistent Cart**: Cart persists across sessions (per user).

#### 4. Checkout & Orders
- **Checkout Flow**: Review cart → Enter/confirm shipping details → Place order.
- **Order Confirmation**: Receive order ID and summary upon successful placement.
- **Order History**: View all past orders with details.
- **Order Tracking**: Check real-time status of current orders.
- **Order Details**: View itemized breakdown of each order.

### 👔 Admin Features

#### 5. Dashboard & Analytics
- **Sales Overview**: Total revenue, total orders, books sold.
- **Recent Orders**: Quick view of latest customer orders.
- **Low Stock Alerts**: Notifications for books below threshold.
- **Top Selling Books**: Analytics on bestsellers.
- **Revenue Trends**: Monthly/weekly sales charts.

#### 6. Inventory Management
- **Book CRUD**: Create, read, update, delete books.
- **Bulk Upload**: Add multiple books (future: CSV import).
- **Stock Management**: Update stock quantities and availability.
- **Category Management**: Create and manage book categories.
- **Image Upload**: Upload and manage book cover images.
- **Price Updates**: Modify pricing with validation.

#### 7. Order Management
- **Order Dashboard**: View all customer orders with filters.
- **Order Details**: Access complete order information.
- **Status Updates**: Update order status (Pending → Processing → Shipped → Delivered).
- **Order Search**: Search orders by ID, customer, or date.
- **Cancel Orders**: Cancel orders before shipping.

---

## Tech Stack

| Layer          | Technology                                      |
|----------------|--------------------------------------------------|
| **Frontend**   | React.js, Redux (state management), Axios       |
| **Backend**    | Node.js (Express.js), TypeScript                 |
| **Database**   | PostgreSQL (relational data)                     |
| **Auth**       | JWT (JSON Web Tokens) + bcrypt (password hash)   |
| **API**        | RESTful API design                               |
| **Testing**    | Jest, React Testing Library, Supertest           |
| **DevOps**     | Docker, GitHub Actions (CI/CD)                   |
| **Storage**    | Local file system / Cloud storage (images)       |

---

## Architecture Principles

- **Clean Architecture**: Controllers → Services → Repositories separation
- **OOP Principles**: Encapsulation, Abstraction, Inheritance, Polymorphism
- **Design Patterns** (applied where appropriate):
  - **Strategy** — Different discount/pricing strategies
  - **Observer** — Order status change notifications
  - **Factory** — Creating different order types, user roles
  - **Repository** — Data access abstraction
  - **Singleton** — Database connection pool
  - **Decorator** — Adding features to orders (gift wrap, express shipping)
  - **Chain of Responsibility** — Order validation pipeline
  - **State** — Order lifecycle management
- **SOLID Principles** adherence
- **RESTful API** best practices
- **DTO Pattern** for data transfer between layers

---

## User Roles

| Role          | Description                                                   |
|---------------|---------------------------------------------------------------|
| **Customer**  | Can browse, search, add to cart, place orders, view history.  |
| **Admin**     | Full access to inventory, orders, analytics, and settings.    |

---

## Entity Relationships Overview

- **Users** can place multiple **Orders**
- **Orders** contain multiple **OrderItems** (books with quantities)
- **Books** belong to **Categories**
- **OrderItems** reference **Books** at the time of purchase
- **Carts** are tied to **Users** and contain **Books**