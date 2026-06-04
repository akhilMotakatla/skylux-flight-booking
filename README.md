# ✈ SkyLux — Luxury Flight Booking Platform

<div align="center">

![SkyLux](https://img.shields.io/badge/SkyLux-Flight%20Booking-d4a017?style=for-the-badge&logo=airplane)
![Angular](https://img.shields.io/badge/Angular-20-DD0031?style=for-the-badge&logo=angular)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet)
![SQLite](https://img.shields.io/badge/SQLite-EF%20Core-003B57?style=for-the-badge&logo=sqlite)

**A full-stack luxury flight booking web application with a stunning 3D airport experience**

[Features](#-features) • [Screenshots](#-screenshots) • [Quick Start](#-quick-start) • [API Docs](#-api-endpoints) • [Architecture](#-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Detailed Setup](#-detailed-setup)
- [Running the Project](#-running-the-project)
- [Default Credentials](#-default-credentials)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Architecture](#-architecture)

---

## 🌟 Overview

SkyLux is a premium flight booking platform built from scratch using **Angular 20** (frontend) and **ASP.NET Core 8** (backend) with an **SQLite** database. It features a real-time 3D interactive globe, glassmorphism UI, 291 worldwide airports, 138,000+ seeded flights, a built-in AI chatbot, and a complete end-to-end booking system.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌍 **Global Coverage** | 291 airports across every country, 24 airlines, 138,000+ flights |
| ✈ **Smart Search** | Search by city name, IATA code, or partial match — finds "df" → DFW |
| 🔗 **Connecting Flights** | Automatic 1-stop itineraries via 30 global hubs when no direct flight |
| 🪑 **Seat Selection** | Interactive visual seat map with availability |
| 📋 **Booking Wizard** | 4-step flow: Seats → Passengers → Payment → Confirmation |
| 🤖 **AI Chatbot** | SkyAssist chatbot — searches real flights from natural language |
| 👤 **Authentication** | JWT-based register/login with role-based access |
| 📊 **Dashboard** | View, manage & cancel bookings |
| 🛠 **Admin Panel** | Manage flights, users, and all bookings |
| 🌐 **3D Globe** | Three.js globe with animated gold flight arc lines |
| ✨ **Particle FX** | Animated gold/white particles + flight streak effects |
| 💎 **Luxury UI** | Glassmorphism, parallax scrolling, 3D card tilt, gold shimmer |
| 📱 **Responsive** | Mobile, tablet, and desktop optimised |

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Angular (standalone components, Signals) | 20 |
| Backend | ASP.NET Core Web API | .NET 8 |
| Database | SQLite via Entity Framework Core | 8.0 |
| Authentication | JWT Bearer (HMAC-SHA256) | — |
| 3D Graphics | Three.js | 0.160 |
| Styling | SCSS custom design system | — |
| Password Hashing | BCrypt.Net-Next | 4.0 |

---

## 📦 Prerequisites

Install all of these before running the project:

### 1. Node.js & npm
```
https://nodejs.org/  →  Download LTS (v22+)
```
Verify: `node --version`  →  should print `v22.x.x`

### 2. .NET 8 SDK
```
https://dotnet.microsoft.com/download/dotnet/8.0
```
Verify: `dotnet --version`  →  should print `8.0.x`

### 3. Angular CLI
```bash
npm install -g @angular/cli
```
Verify: `ng version`  →  should show Angular CLI 17+

### 4. EF Core CLI Tools (for database migrations)
```bash
dotnet tool install --global dotnet-ef
```
Verify: `dotnet ef --version`  →  should print `8.0.x`

### 5. Git
```
https://git-scm.com/downloads
```

---

## 🚀 Quick Start

> Run these commands in order — the project will be up in under 5 minutes.

### Step 1 — Clone the repository

```bash
git clone https://github.com/akhilMotakatla/skylux-flight-booking.git
cd skylux-flight-booking
```

### Step 2 — Start the Backend (Terminal 1)

```bash
cd backend/FlightBooking.API
dotnet restore
dotnet run
```

✅ **Backend ready at:** `http://localhost:5000`
✅ **Swagger UI at:** `http://localhost:5000/swagger`

> **Note:** First run auto-creates the SQLite database and seeds **291 airports, 24 airlines, and 138,000+ flights** across 14 days. This takes ~60–90 seconds on first boot. Watch for:
> ```
> info: Microsoft.Hosting.Lifetime[14]
>       Now listening on: http://localhost:5000
> ```

### Step 3 — Start the Frontend (Terminal 2)

```bash
cd frontend
npm install
ng serve
```

✅ **Frontend ready at:** `http://localhost:4200`

Open your browser and go to **[http://localhost:4200](http://localhost:4200)**

---

## 📖 Detailed Setup

### Backend Setup

```bash
# 1. Navigate to the API project
cd backend/FlightBooking.API

# 2. Restore NuGet packages
dotnet restore

# 3. (Optional) Apply migrations manually
dotnet ef database update

# 4. Run the API
dotnet run

# Or run in watch mode (auto-reloads on code changes)
dotnet watch run
```

**What happens on first run:**
- EF Core applies migrations → creates `flightbooking.db`
- Seed data inserts 291 airports, 24 airlines, 2 demo users
- 138,320 flights generated for the next 14 days (5 per route per day)
- App listens on `http://localhost:5000`

**Configuration** (`backend/FlightBooking.API/appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=flightbooking.db"
  },
  "Jwt": {
    "Key": "SkyLuxSuperSecretJwtKey2025!AtLeast32Chars#",
    "Issuer": "FlightBookingAPI",
    "Audience": "FlightBookingClient",
    "ExpiresInHours": "24"
  },
  "Cors": {
    "AllowedOrigins": ["http://localhost:4200"]
  }
}
```

### Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
ng serve

# Or start on a custom port
ng serve --port 4201

# Build for production
ng build --configuration production
```

**Environment config** (`frontend/src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000'   // points to your backend
};
```

---

## ▶ Running the Project

### Running Both Servers (Recommended)

Open **two terminal windows** side by side:

**Terminal 1 — Backend:**
```bash
cd "backend/FlightBooking.API"
dotnet run
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install    # only needed first time
ng serve
```

Then open **http://localhost:4200** in your browser.

### Port Reference

| Service | URL | Notes |
|---------|-----|-------|
| Frontend (Angular) | http://localhost:4200 | Main app |
| Backend API | http://localhost:5000 | REST API |
| Swagger UI | http://localhost:5000/swagger | API testing |
| SQLite DB file | `backend/FlightBooking.API/flightbooking.db` | Auto-created |

---

## 🔑 Default Credentials

Two accounts are seeded automatically:

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@skylux.com | Admin@123 | Full admin panel + all features |
| **User** | demo@skylux.com | Demo@123 | Booking + dashboard |

You can also register a new account at `/register`.

---

## 📁 Project Structure

```
skylux-flight-booking/
│
├── backend/
│   └── FlightBooking.API/
│       ├── Controllers/
│       │   ├── AuthController.cs          # Register, Login
│       │   ├── FlightsController.cs       # Search, Get by ID
│       │   ├── BookingsController.cs      # Create, List, Cancel
│       │   ├── AirportsController.cs      # Typeahead search
│       │   ├── ChatController.cs          # SkyAssist chatbot
│       │   └── AdminController.cs        # Admin CRUD
│       ├── Data/
│       │   ├── AppDbContext.cs            # EF Core context
│       │   └── SeedData.cs               # 291 airports, 24 airlines, 138k flights
│       ├── Models/                        # User, Airport, Airline, Flight, Booking, ChatMessage
│       ├── DTOs/                          # Auth, Flights (with connection fields), Bookings, Chat
│       ├── Services/
│       │   ├── JwtService.cs             # Token generation/validation
│       │   ├── FlightService.cs          # Direct + connecting flight search
│       │   ├── BookingService.cs         # Booking CRUD with seat management
│       │   └── ChatService.cs            # Rule-based AI chatbot engine
│       ├── appsettings.json
│       └── Program.cs                    # DI, CORS, JWT, EF, Swagger
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── core/
│       │   │   ├── guards/               # authGuard, adminGuard
│       │   │   ├── interceptors/         # JWT attach, loading bar
│       │   │   ├── services/             # AuthService, FlightService, BookingService...
│       │   │   └── models/               # TypeScript interfaces
│       │   ├── features/
│       │   │   ├── home/                 # Landing page (3D globe, particle FX, search)
│       │   │   ├── auth/                 # Login + Register (3D tilt cards)
│       │   │   ├── flights/              # Flight search results + connection badges
│       │   │   ├── booking/              # 4-step booking wizard + seat map
│       │   │   ├── dashboard/            # User bookings + cancellation
│       │   │   └── admin/                # Admin tables for flights/users/bookings
│       │   ├── layout/
│       │   │   ├── navbar/               # Transparent → glassmorphism on scroll
│       │   │   ├── footer/
│       │   │   └── chatbot/              # SkyAssist floating chatbot
│       │   └── shared/
│       │       └── components/
│       │           └── airport-autocomplete/  # Live typeahead component
│       ├── styles/
│       │   ├── _variables.scss           # Navy/gold colour palette
│       │   ├── _mixins.scss              # glass-card, btn-gold, responsive
│       │   ├── _animations.scss          # particle-float, flight-streak, shimmer
│       │   └── _glassmorphism.scss       # Utility glass classes
│       └── environments/
│           ├── environment.ts            # Dev: localhost:5000
│           └── environment.prod.ts       # Prod: update with your domain
│
└── README.md
```

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/register` | `{name, email, password}` | JWT token + user info |
| POST | `/api/auth/login` | `{email, password}` | JWT token + user info |

### Airports
| Method | Endpoint | Params | Response |
|--------|----------|--------|----------|
| GET | `/api/airports/search` | `?q=df` | Matching airports (IATA + city + country) |
| GET | `/api/airports` | — | All 291 airports |

### Flights
| Method | Endpoint | Params | Response |
|--------|----------|--------|----------|
| GET | `/api/flights/search` | `?from=JFK&to=DFW&date=2026-06-15&passengers=1&class=Economy` | Direct + connecting flights |
| GET | `/api/flights/{id}` | — | Single flight details |

### Bookings *(requires JWT)*
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/bookings` | `{flightId, passengers[], seatNumbers[], paymentMethod}` | Booking confirmation |
| GET | `/api/bookings/my` | — | All user bookings |
| DELETE | `/api/bookings/{id}` | — | Cancel booking |

### Chatbot
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/chat/message` | `{message, sessionId}` | Bot response + optional flight results |

### Admin *(requires Admin JWT)*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/flights` | Paginated flight list |
| POST | `/api/admin/flights` | Create new flight |
| PUT | `/api/admin/flights/{id}` | Update flight |
| DELETE | `/api/admin/flights/{id}` | Delete flight |
| GET | `/api/admin/users` | All users with booking counts |
| GET | `/api/admin/bookings` | All bookings (paginated) |

### Using the API with curl

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@skylux.com","password":"Demo@123"}'

# Search flights (JFK → DFW)
curl "http://localhost:5000/api/flights/search?from=JFK&to=DFW&date=2026-06-15&passengers=1"

# Chat with SkyAssist
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"flights from JFK to London","sessionId":"test"}'
```

---

## ⚙ Configuration

### Changing the Database

To use **SQL Server** instead of SQLite:

1. Install the package:
   ```bash
   dotnet add package Microsoft.EntityFrameworkCore.SqlServer
   ```
2. In `Program.cs`, replace:
   ```csharp
   opts.UseSqlite(...)  →  opts.UseSqlServer(...)
   ```
3. Update the connection string in `appsettings.json`

### JWT Secret Key

Change the key in `appsettings.json` for production:
```json
"Jwt": {
  "Key": "YourNewSuperSecretKeyAtLeast32CharactersLong!"
}
```

### Running on Different Ports

Backend on port 7000:
```bash
dotnet run --urls http://localhost:7000
```

Update frontend environment to match:
```typescript
// frontend/src/environments/environment.ts
apiUrl: 'http://localhost:7000'
```

### Production Build

Frontend:
```bash
cd frontend
ng build --configuration production
# Output in: frontend/dist/frontend/
```

Backend:
```bash
cd backend/FlightBooking.API
dotnet publish -c Release -o ./publish
```

---

## 🔧 Troubleshooting

### ❌ `dotnet ef` command not found
```bash
dotnet tool install --global dotnet-ef
# Then restart your terminal
```

### ❌ Angular build errors — missing packages
```bash
cd frontend
npm install --legacy-peer-deps
```

### ❌ CORS errors in browser
Make sure the backend is running on port 5000. Check `appsettings.json`:
```json
"AllowedOrigins": ["http://localhost:4200"]
```

### ❌ Frontend can't connect to backend
1. Ensure backend is running: visit `http://localhost:5000/swagger`
2. Check `frontend/src/environments/environment.ts` has `apiUrl: 'http://localhost:5000'`

### ❌ Seeding is slow (first boot only)
First boot seeds **138,000+ flights** — this takes 60–90 seconds. The API is ready when you see:
```
Now listening on: http://localhost:5000
```

### ❌ No flights found for a route
- Use the airport autocomplete — type city name or partial IATA (e.g., "df" → DFW)
- Flights are seeded for the **next 14 days** from the date you first run the backend
- If the backend has been running for 14+ days, delete `flightbooking.db` and restart

### ❌ Port already in use
```bash
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use a different port
dotnet run --urls http://localhost:5001
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Angular 20)                  │
│  ┌──────────┐  ┌───────────┐  ┌────────┐  ┌─────────┐  │
│  │  Home    │  │  Flights  │  │Booking │  │ Chatbot │  │
│  │ (Globe + │  │ (Results +│  │(Wizard)│  │(Bottom  │  │
│  │ Particle)│  │ Filters)  │  │        │  │ Right)  │  │
│  └────┬─────┘  └─────┬─────┘  └───┬────┘  └────┬────┘  │
│       │              │             │             │        │
│  ┌────┴──────────────┴─────────────┴─────────────┴────┐  │
│  │         HTTP Client + JWT Interceptor               │  │
│  └─────────────────────────┬───────────────────────────┘  │
└────────────────────────────┼────────────────────────────┘
                             │ HTTP/REST (port 5000)
┌────────────────────────────┼────────────────────────────┐
│         ASP.NET Core 8 Web API                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │   Auth   │  │ Flights  │  │Bookings  │  │  Chat  │  │
│  │Controller│  │Controller│  │Controller│  │ Ctrl   │  │
│  └────┬─────┘  └─────┬────┘  └────┬─────┘  └───┬────┘  │
│       │              │             │             │        │
│  ┌────┴──────────────┴─────────────┴─────────────┴────┐  │
│  │     Services: JWT · Flight · Booking · Chat         │  │
│  └─────────────────────────┬───────────────────────────┘  │
│  ┌──────────────────────────┴───────────────────────────┐  │
│  │         Entity Framework Core + AppDbContext          │  │
│  └─────────────────────────┬───────────────────────────┘  │
└────────────────────────────┼────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │  flightbooking  │
                    │    .db (SQLite) │
                    │  291 airports   │
                    │  24  airlines   │
                    │  138k flights   │
                    └─────────────────┘
```

### Key Design Decisions

| Decision | Reason |
|----------|--------|
| **SQLite** | Zero-config, file-based — swap to SQL Server with one line |
| **Angular Signals** | Modern reactive primitive for chatbot + UI state (no RxJS overhead for simple state) |
| **Functional Guards & Interceptors** | Angular 17+ pattern, tree-shakable |
| **JWT in localStorage** | Acceptable for demo — use HttpOnly cookies in production |
| **Rule-based Chatbot** | Self-contained, offline, covers 90% of real queries — upgrade to LLM API later |
| **3D Globe as progressive enhancement** | WebGL unavailable → search widget still works |
| **Batched DB seeding** | 500-record batches prevent SQLite locking during large inserts |
| **5 flights per route per day** | Realistic availability across Economy/Business/First + multiple airlines |

---

## 🤖 SkyAssist Chatbot — Supported Queries

| Query Type | Example |
|-----------|---------|
| Greeting | "Hello", "Hi there" |
| Flight search | "flights from JFK to London", "fly from DXB to SIN" |
| Cancellation | "cancel my booking", "refund policy" |
| Baggage | "baggage allowance", "luggage limit" |
| Check-in | "online check-in", "boarding pass" |
| Booking status | "my bookings", "reservation" |
| Pricing | "cheap flights", "business class price" |
| In-flight | "wifi on flight", "meal options" |
| Support | "contact support", "speak to agent" |
| Destinations | "popular routes", "where to fly" |

---

## 📊 Data Coverage

### Airports by Region

| Region | Count | Countries |
|--------|-------|-----------|
| USA | 35 | United States |
| Europe | 65+ | UK, France, Germany, Spain, Italy, Scandinavia, Eastern Europe... |
| Middle East | 18 | UAE, Qatar, Saudi Arabia, Turkey, Israel, Iran... |
| Asia-Pacific | 75+ | Japan, China, Korea, India, SEA, Australia, NZ... |
| Africa | 25 | South Africa, Kenya, Nigeria, Egypt, Morocco... |
| Americas (non-US) | 45+ | Canada, Mexico, Brazil, Colombia, Chile, Peru... |
| **Total** | **291** | **100+ countries** |

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">

**Built with ✈ by SkyLux — Where luxury meets the sky**

*Angular 20 · .NET 8 · SQLite · Three.js · SCSS*

</div>
