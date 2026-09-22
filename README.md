# Ghazi Enterprise (Next.js)

Full-stack Next.js app — **frontend + API + MySQL** in one project.

The legacy `ghazi-enterprise-frontend` (Vite) and `ghazi-enterprise-backend` (Express) folders can be retired; use this app instead.

## Run locally

1. Copy `.env.example` to `.env` and set MySQL credentials.
2. Ensure MySQL database `ghazi_enterprise` exists.
3. Install and start:

```powershell
cd ghazi-enterprise
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Admin:** `/admin/login` — `admin@ghazienterprise.com` / `admin123`

## Database init

On first server start, `instrumentation.js` runs `initDb()`:

- Creates tables
- Seeds admin user and categories
- Seeds 13 products if the catalog is empty

## API routes (same as before)

| Route | Description |
|-------|-------------|
| `POST /api/auth/login` | Admin login |
| `GET/POST /api/products` | Catalog / create |
| `GET/PUT/DELETE /api/products/[id]` | Product CRUD |
| `GET/POST /api/categories` | Categories |
| `DELETE /api/categories/[id]` | Delete category |
| `POST /api/orders` | Checkout |
| `GET /api/orders` | Admin orders |
| `PATCH /api/orders/[id]/status` | Update status |
| `DELETE /api/orders/[id]` | Delete order |
