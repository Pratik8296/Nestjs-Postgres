# NestJS + PostgreSQL API

A production-ready REST API with JWT authentication, real-time WebSocket support, and PostgreSQL integration using Prisma ORM.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

```bash
npm install
npm run prisma:generate
```

### Configuration

Create `.env` file:
```
DATABASE_URL="postgresql://user:password@localhost:5432/database"
JWT_SECRET=your-secret-key-here
PORT=3000
NODE_ENV=development
```

### Running

**Development:**
```bash
npm run start:dev
```

**Production:**
```bash
npm run build
npm run start:prod
```

## API Endpoints

**Authentication:**
- `POST /api/auth/login` - Login with email/password

**Users:**
- `POST /api/users` - Create user
- `GET /api/users` - List users (supports optional `role` query parameter)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

**Messages:**
- `GET /api/messages` - List all messages
- `GET /api/messages/user/:userId` - Get messages by user
- `DELETE /api/messages/:id` - Delete message

**WebSocket Events:**
- `message` - Broadcast message to all connected clients
- `typing` - Send typing indicator
- `direct-message` - Send direct message to a specific user
- `get-users` - Get list of connected users

## Database Schema

**Models:**
- **User** - email, password, name, role (USER/ADMIN)
- **Post** - title, content, published status, author reference
- **Message** - text, sender reference, timestamp

**Migrations:**
```bash
npm run prisma:migrate:dev --name "feature_name"
npm run prisma:migrate:deploy
npm run prisma:studio
npm run prisma:generate
```

## Features

✅ JWT authentication with middleware-based token validation  
✅ Real-time WebSocket messaging (authenticated & unauthenticated clients)  
✅ PostgreSQL with Prisma ORM and database migrations  
✅ Request validation with class-validator  
✅ Global error handling  
✅ Rate limiting (Throttler module)  
✅ Security headers (Helmet)  
✅ CORS enabled  
✅ Environment configuration validation  

## Architecture

- **Authentication**: JWT with `JwtMiddleware` for optional token validation
- **WebSocket**: `SocketGateway` handles real-time events with support for both authenticated and unauthenticated connections
- **Database**: Prisma ORM with PostgreSQL adapter for SSL and connection pooling
- **Validation**: Class-validator decorators on DTOs with global `ValidationPipe`
- **Rate Limiting**: Throttler guards configured with short (1s/1 req) and long (60s/5 req) windows

## Development

```bash
npm run lint                  # Run ESLint
npm run build                 # Build TypeScript
npm run start:dev             # Development with hot-reload
npm run prisma:studio         # Open Prisma Studio UI
npm run prisma:migrate:dev    # Create and apply migrations
npm run prisma:reset          # Reset database (dev only)
```

## Project Structure

```
src/
├── app.module.ts            # Root module with all feature modules
├── app.controller.ts         # Health check endpoint
├── main.ts                   # Application bootstrap
├── users/                    # Users module (CRUD operations)
├── messages/                 # Messages module (message persistence)
├── socket/                   # WebSocket gateway for real-time messaging
├── auth/                     # Authentication module (login, JWT)
├── database/                 # Database service with Prisma client
├── logger/                   # Logging service
└── config/                   # Configuration and validation
prisma/
├── schema.prisma             # Database schema definitions
└── migrations/               # Migration history
```

## Dependencies

**Core:**
- NestJS 11.x
- Prisma 7.x
- PostgreSQL

**Features:**
- `@nestjs/jwt` - JWT token management
- `@nestjs/websockets` - WebSocket support
- `@nestjs/throttler` - Rate limiting
- `class-validator` - Request validation
- `bcrypt` - Password hashing
- `helmet` - Security headers
- `socket.io` - Real-time communication

**Dev Tools:**
- TypeScript 5.x
- ESLint with TypeScript support
- Jest for testing

## License

UNLICENSED
