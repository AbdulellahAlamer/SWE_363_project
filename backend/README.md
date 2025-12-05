# KFUPM Clubs Hub – Backend API

Node.js/Express API for the KFUPM Clubs Hub frontend. Provides authentication, user management, and JWT-protected routes the frontend pages can call.

## Tech Stack

- Node.js, Express
- MongoDB with Mongoose
- JWT for auth
- Helmet, CORS, body-parser, morgan

## Quick Start

```bash
npm install
cp config.example.env config.env   # create your env file
npm run dev                        # or: npm start
```

## Environment Variables (minimal)

Set these in `config.env` (or your host env):

- `PORT` – API port (default 5000)
- `HOST` – Hostname (default localhost)
- `DATABASE` – MongoDB URI (required)
- `JWT_SECRET` – long random string (required for production)
- `JWT_EXPIRES_IN` – token lifetime (default 24h)
- `APP_NAME` – optional display name
- `CORS_ORIGIN` – optional; default allows all (`*`). Set your frontend origin in production.

## API Overview

- `POST /api/v1/auth/register` – create account
- `POST /api/v1/auth/login` – authenticate and receive JWT
- `GET /api/v1/auth/me` – current user (protected)
- `POST /api/v1/auth/change-password` – update password (protected)

- `GET /api/v1/users` – list users (admin)
- `GET /api/v1/users/:id` – get user (protected/self or admin)
- `PUT /api/v1/users/:id` – update user (protected/self or admin)
- `DELETE /api/v1/users/:id` – delete user (protected/self or admin)

Authentication: send `Authorization: Bearer <token>` returned from login. The auth middleware (`protectRoute`) populates `req.user`.

## Frontend Integration Notes

- Point the frontend auth calls to the `/api/v1/auth/*` endpoints above.
- Ensure `CORS_ORIGIN` includes the frontend host; when `origin` is `*`, avoid `withCredentials` requests.
- Store the JWT on the client (Authorization header) or set up HttpOnly cookies if you extend the API.

## Development

- Logs use `dev` format in development and `combined` in production.
- CORS is open by default; tighten it for production.
- Rate limiting has been removed; add it back in `api/server.js` if needed.

## Testing

Jest/Supertest are configured. Run:

```bash
npm test
```

## Structure

- `api/server.js` – Express app wiring, middleware, routes
- `config/config.js` – app/db/jwt/cors settings
- `config/db.js` – Mongo connection and health check
- `controllers/` – auth and user controllers (business logic in controllers)
- `middleware/` – auth/role checks
- `models/` – Mongoose models
- `routes/` – route definitions
- `utils/jwt.js` – token helpers

## Deployment Tips

- Set `NODE_ENV=production`, `JWT_SECRET` (32+ chars), and a production Mongo URI.
- Restrict `CORS_ORIGIN` to your frontend domain(s).
- Add HTTPS, secure cookies (if you adopt them), and rate limiting before going live.\*\*\*

## API quick docs

All protected routes require `Authorization: Bearer <token>`.

- **POST /api/v1/auth/login**  
  Request:

```json
{ "email": "user@example.com", "password": "123456" }
```

Response 200:

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "jwt_token",
    "user": { "id": "…", "email": "user@example.com", "role": "student" }
  }
}
```

- **GET /api/v1/events** (protected)  
  Query params: `club=<clubId>` to filter, `user=<userId>` to exclude events the user is already registered to.  
  Response 200:

```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "_id": "…",
      "title": "ByteBank Hackathon",
      "description": "ByteBank Hackathon",
      "date": "2025-12-10T00:00:00.000Z",
      "type": "Other",
      "registrations": ["userId123"],
      "club": { "_id": "clubId123", "name": "test_club" }
    }
  ]
}
```

- **POST /api/v1/events/mark-attendance?eventId=<id>** (protected)  
  Marks attendance for a registered user.  
  Response 200:

```json
{
  "status": "success",
  "message": "Attendance marked successfully",
  "data": {
    "eventId": "…",
    "eventTitle": "ByteBank Hackathon",
    "attendanceCount": 5
  }
}
```

- **POST /api/v1/posts** (protected: admin/president)  
  Create a post for a club:

```json
{
  "title": "Announcement",
  "description": "Body text",
  "tag": "General",
  "club": "clubId123"
}
```

Response 201 contains the created post.

More endpoints live under `backend/routes` (auth, users, clubs, posts, events). Refer to `backend/API.md` for the full list if needed.
