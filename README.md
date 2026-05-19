# Hop Lynk — Production-Ready MERN URL Shortener

A full-stack URL Shortener built with **MongoDB, Express, React, and Node.js**. Features JWT authentication, per-link analytics with charts, QR code generation, custom aliases, and expiration dates.

---

## Features

| Category | Features |
|----------|----------|
| **Auth** | Signup, Login, Logout, JWT HTTP-only cookies, persist auth |
| **URLs** | Create, Edit, Delete, Copy, Custom alias, Expiration date, Active/inactive toggle |
| **Analytics** | Total clicks, Browser, OS, Device, Country, Referrer, Last visited, Clicks over time |
| **UI** | Dark/Light mode, Responsive, Skeletons, Toast notifications, QR Code download |
| **Security** | Helmet, Rate limiting, Mongo sanitize, bcrypt, No IP storage |

---

## Stack

- **Frontend**: React 18 + Vite + Tailwind CSS v4 + Zustand + Recharts
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Auth**: JWT + HTTP-only cookies + bcrypt
- **Analytics**: geoip-lite + ua-parser-js (privacy-safe, no IP stored)

---

## Project Structure

```
URL Shortener/
├── server/          # Express API
│   ├── config/       # MongoDB connection
│   ├── controllers/  # Route handlers
│   ├── middleware/   # Auth, error, tracking
│   ├── models/       # User, Url, Analytics schemas
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── utils/        # JWT, nanoid, UA parser, validators
└── client/         # React app
    └── src/
        ├── components/   # UI, auth, url, analytics components
        ├── context/      # ThemeContext
        ├── hooks/        # useUrls, useAnalytics
        ├── layouts/      # AuthLayout, DashboardLayout
        ├── pages/        # Landing, Login, Signup, Dashboard, Analytics
        ├── services/     # Axios instance
        ├── store/        # Zustand authStore
        └── utils/        # Validators, formatters
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)

### 1. Clone & Setup Backend

```bash
cd server
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```

The app will be at **http://localhost:5173**, server at **http://localhost:5000**.

---

## Environment Variables

### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urlshortener
JWT_SECRET=your_super_secret_key_at_least_32_chars
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Hop Lynk
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/api/auth/signup` | ❌ | Register |
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/logout` | ✅ | Logout |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/urls` | ✅ | List URLs (paginated, searchable) |
| POST | `/api/urls` | ✅ | Create short URL |
| GET | `/api/urls/:id` | ✅ | Get URL |
| PATCH | `/api/urls/:id` | ✅ | Update URL |
| DELETE | `/api/urls/:id` | ✅ | Delete URL |
| PATCH | `/api/urls/:id/toggle` | ✅ | Toggle active/inactive |
| GET | `/r/:shortCode` | ❌ | Redirect + track analytics |
| GET | `/api/analytics/:urlId` | ✅ | Get URL analytics |

---

## Security

- **Helmet** — secure HTTP headers
- **Rate limiting** — 200 req/15 min global, 10 req/15 min on auth routes
- **HTTP-only cookies** — JWT never exposed to JS
- **SameSite cookies** — CSRF protection
- **express-mongo-sanitize** — NoSQL injection prevention
- **bcrypt (cost 12)** — password hashing
- **No IP storage** — IPs used only for geo-lookup then discarded

---

## Deployment

### Backend (e.g., Railway / Render)

1. Set environment variables (see above)
2. Set `NODE_ENV=production`
3. Use `npm start` as start command

### Frontend (e.g., Vercel / Netlify)

1. Set `VITE_API_URL` to your production server URL
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add redirect rule: `/* → /index.html` (200)

---

## License

MIT
