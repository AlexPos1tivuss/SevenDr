# Replit.md

## Overview

This is a full-stack e-commerce application for a children's toy wholesaler called "Семь Драконов" (Seven Dragons). The application is built with React frontend and Express backend, using PostgreSQL with Drizzle ORM for data persistence. The system allows B2B customers to register, browse products, place orders, and communicate with administrators through a chat system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state, local state with React hooks
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with CSS variables for theming

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **File Upload**: Multer for handling multipart/form-data
- **Development**: tsx for TypeScript execution in development

### Database Layer
- **ORM**: Drizzle ORM with Neon PostgreSQL adapter
- **Database**: PostgreSQL (configured for Neon serverless)
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Authentication System
- User registration with company information and logo upload
- Simple login system with email/password
- Admin user support with special privileges
- Client-side authentication state management

### Product Management
- Product catalog with categories, age groups, materials
- Tiered pricing system (5+, 20+, 50+ quantity breaks)
- Image management for product displays
- Inventory tracking with stock status

### Order Management
- Shopping cart functionality with quantity-based pricing
- Order placement with delivery address
- Order status tracking (Новый, В обработке, Отправлен, Доставлен)
- Order history for customers

### Communication System
- Chat system tied to orders
- Real-time messaging between customers and administrators
- Message persistence and history

### User Interface
- Responsive design with mobile-first approach
- Component-based architecture using shadcn/ui
- Custom styling with Tailwind CSS
- Notification system for user feedback

## Data Flow

1. **User Registration**: Frontend form → Multer file upload → Database insertion
2. **Product Browsing**: Frontend query → Backend API → Database query → JSON response
3. **Order Placement**: Cart state → API request → Database transaction → Chat creation
4. **Chat Communication**: Message input → API request → Database insertion → Query refresh

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Query)
- UI components (@radix-ui/react-* components)
- Styling (Tailwind CSS, class-variance-authority)
- Form handling (React Hook Form, Zod validation)
- Utilities (clsx, date-fns, lucide-react icons)

### Backend Dependencies
- Express.js with middleware
- Database (@neondatabase/serverless, drizzle-orm)
- File handling (multer for uploads)
- Session management (connect-pg-simple)
- Development tools (tsx, vite)

### Development Tools
- TypeScript for type safety
- ESLint and Prettier for code quality
- Vite for fast development server
- Drizzle Kit for database schema management

## Deployment Strategy

### Build Process
1. Frontend: Vite builds React app to `dist/public`
2. Backend: esbuild bundles server code to `dist/index.js`
3. Database: Drizzle pushes schema changes to PostgreSQL

### Environment Requirements
- Node.js environment with ES modules support
- PostgreSQL database (Neon serverless compatible)
- File system access for uploads directory
- Environment variables for database connection

### Production Considerations
- Static file serving from Express
- Database connection pooling
- File upload storage (currently local filesystem)
- Environment-specific configuration

## Changelog

```
Changelog:
- July 04, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```