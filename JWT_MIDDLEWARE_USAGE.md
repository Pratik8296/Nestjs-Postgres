# JWT Middleware-Based Auth Usage Guide

This project now uses **middleware-based JWT authentication** instead of guards/Passport. The middleware automatically extracts and validates JWT tokens from request headers and attaches the decoded user to `req.user`.

## How It Works

1. **Middleware automatically validates JWT**: The `JwtMiddleware` runs on all routes (`forRoutes('*')`).
2. **Token extraction**: Expects header: `Authorization: Bearer <token>`
3. **User attachment**: If valid, decoded payload is attached to `req.user`.
4. **Optional access**: Routes without a guard allow both authenticated and unauthenticated requests.

## Using in Controllers

### 1. Public endpoint (no auth required)

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('public')
export class PublicController {
  @Get('data')
  getPublicData() {
    return { message: 'This is public' };
  }
}
```

### 2. Optional auth (works with or without token)

```typescript
import { Controller, Get, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';

@Controller('users')
export class UsersController {
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) {
    if (req.user) {
      return { message: `Welcome ${req.user.email}`, user: req.user };
    }
    return { message: 'No user logged in' };
  }
}
```

### 3. Protected endpoint (auth required)

```typescript
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { RequiredAuthGuard } from 'src/auth/auth.guard';

@Controller('protected')
export class ProtectedController {
  @UseGuards(RequiredAuthGuard)
  @Get('data')
  getProtectedData(@Request() req: ExpressRequest) {
    return { message: `Data for user ${req.user.email}`, user: req.user };
  }
}
```

## How to Test

### 1. Create a user

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Login and get token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Call protected endpoint with token

```bash
curl http://localhost:3000/api/protected/data \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Call without token (will fail if using `RequiredAuthGuard`)

```bash
curl http://localhost:3000/api/protected/data
```

Response:
```json
{
  "message": "Authentication required",
  "statusCode": 401,
  "error": "Unauthorized"
}
```

## Environment Variables

Required in `.env`:

```
JWT_SECRET=your-secure-secret-here
JWT_EXPIRES_IN=3600
DATABASE_URL=postgresql://...
```

## Files Modified

- `src/auth/jwt.middleware.ts` — Core middleware that validates JWT
- `src/auth/auth.module.ts` — Registers middleware for all routes
- `src/auth/auth.guard.ts` — Optional/Required guards for protecting routes
- `package.json` — Removed `@nestjs/passport` and passport packages

## Key Advantages

✅ Simpler than Passport/Guards  
✅ Middleware runs globally, no per-route setup needed  
✅ Manual control over where auth is required (use guards on specific endpoints)  
✅ Direct access to `req.user` in all controllers  
✅ Fewer dependencies

## Optional: Modify Middleware Behavior

If you want to fail silently (not throw) when token is invalid, modify `jwt.middleware.ts`:

```typescript
try {
  const decoded = this.jwtService.verify(token);
  req.user = decoded;
} catch (err) {
  // Silently skip auth on invalid token (optional)
  req.user = null;
}
next();
```

Then use `RequiredAuthGuard` only on routes that need auth.
