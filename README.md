# KK Global Group Backend

Production-ready backend for a multi-national multi-service business website.

## Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt Password Hashing
- dotenv
- CORS
- MVC structure
- Global error handling
- Role-based authorization

## Project Structure
```
kk-global-group-backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    app.js
    server.js
```

## Setup
1. Copy `.env.example` to `.env`
2. Fill environment values
3. Install dependencies
4. Start server

```bash
npm install
npm run dev
```

Server runs on port `5000` by default.

## Required Environment Variables
```
PORT=5000
MONGODB_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

Optional for admin seeding:
```
ADMIN_NAME=KK Global Admin
ADMIN_EMAIL=admin@kkglobalgroup.com
ADMIN_PASSWORD=Admin@12345
```

## Admin Seed
```bash
npm run seed:admin
```

## Render Deployment
1. Push this backend folder to a GitHub repository.
2. In Render, click `New +` -> `Blueprint`.
3. Select that GitHub repository.
4. Render will detect `render.yaml`.
5. Set required environment variables in Render:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_ORIGIN` (example: `http://localhost:5173,https://manalk14322-max.github.io`)
   - `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`
6. Deploy.
7. After first deploy, run one-time admin seed using Render Shell:
   ```bash
   npm run seed:admin
   ```

## Vercel Deployment (Free Friendly)
1. Push this backend to GitHub branch `backend-api`.
2. Go to Vercel -> `Add New Project` -> import `kk-website` repo.
3. Select branch: `backend-api`.
4. Keep Root Directory as `/`.
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN=7d`
   - `CLIENT_ORIGIN=http://localhost:5173,https://manalk14322-max.github.io`
   - `ADMIN_NAME`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
6. Deploy.
7. Test:
   - `https://<your-vercel-domain>/api/health`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Contact
- `POST /api/contact`
- `GET /api/admin/contacts` (admin only)

### Investor
- `POST /api/investor/apply` (investor only)
- `GET /api/investor/my-applications` (investor only)
- `GET /api/admin/investors` (admin only)
- `PUT /api/admin/investor/:id/approve` (admin only)
- `PUT /api/admin/investor/:id/reject` (admin only)

### Admin Dashboard
- `GET /api/admin/dashboard` (admin only)

Returns:
- total users
- total contacts
- total investors
- approved investors count
