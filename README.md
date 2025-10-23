# Moisture Monitoring

An ESP32-based soil moisture monitoring system using Arduino/PlatformIO firmware, an Express (Node.js) backend API for logging and retrieval, and a simple web client (React + Vite) for visualization.

## Overview

- The ESP32 device reads an analog soil moisture sensor and exposes a local UI and simple endpoints on the local network.
- Moisture readings can be sent to the Express backend to be logged and aggregated into basic statistics (latest, average, min, max, count).
- The web client renders trend charts and summary cards (daily/periodic) using API data.

## Architecture

1) Sensor → ESP32: periodic ADC reading and moisture percentage calculation.
2) ESP32 → API (optional): push moisture values to the backend endpoint.
3) Express API: store logs and serve aggregated/statistical data.
4) Web Client: fetch from API for visualization (line chart + summary).

## Project Components

- `moisture-sensor/` (ESP32 Firmware)
  - Board: NodeMCU-32S (ESP32)
  - Features: local UI, `GET /readMoisture` endpoint, Telegram notifications on dry/wet threshold crossings.
  - Default reading formula (12-bit ADC): `moisture% = 100 - ((analog / 4095.0) * 100)` — calibrate as needed for your sensor.

- `server/` (Express + Sequelize Backend)
  - Persists moisture logs and provides periodic data + statistics.
  - Uses JWT authentication for protected routes.
  - Backed by Sequelize (MySQL by default).
  - Main table: `moisture_logs` (columns: `id`, `moisture_level`, `createdAt`, `updatedAt`).

- `client/` (React + Vite)
  - Simple dashboard: line chart (trend) and summary cards (stats).
  - Consumes API endpoints from the backend.

## Backend API Summary (Express)

Base prefix: `/api/moisture`

Auth:

- `POST /api/moisture/auth/login` — login with `{ email, password }` to receive a JWT token.
  - Response shape:
    - `{ code, message, data: { user: { id, name, email }, token } }`
  - Use the token as `Authorization: Bearer <token>` for the endpoints below.

Logs (all require Bearer token):

- `POST /api/moisture/logs/log` — store a single moisture value.
  - Body: `{ "moisture_level": <number> }`
- `GET /api/moisture/logs/today` — today’s data + stats.
- `GET /api/moisture/logs/three-days` — last 3 days + stats.
- `GET /api/moisture/logs/seven-days` — last 7 days + stats.
- `GET /api/moisture/logs/all-days` — all data + stats.

Typical response shape:

```
{
  "code": <int>,
  "message": <string>,
  "data": {
    "logs": [ ... ],
    "stats": { "latest": <float>, "average": <float>, "min": <float>, "max": <float>, "count": <int> }
  }
}
```

Note: The firmware can optionally post readings to the API at intervals using a simple HTTP POST from the ESP32.

Tip: The web client can be configured with a static JWT via `VITE_APIKEY` in `client/.env` to call the protected endpoints without implementing a login UI.

## Top-level Folder Structure

```
moisture-monitoring/
├─ moisture-sensor/            # ESP32 firmware (Arduino/PlatformIO)
│  ├─ src/main.cpp             # Sensor reading logic & local web server
│  └─ src/config.example.h     # Credentials template (WiFi/Telegram)
├─ server/                     # Express + Sequelize backend (moisture API)
│  ├─ src/app.js               # Express app & route mounting
│  ├─ src/routes/              # Route modules (auth, logs)
│  ├─ src/controllers/         # Controllers (authController, moistureLogController)
│  ├─ src/models/              # Sequelize models (User, MoistureLog)
│  └─ src/migrations/          # Sequelize migrations
└─ client/                     # Web client (React + Vite)
  └─ src/                     # UI components (chart, stats)
```

## Key Features

- Read soil moisture from an analog sensor (ESP32)
- On-device local UI + `GET /readMoisture` endpoint
- Telegram notifications on dry/wet thresholds (configurable)
- Backend logging with automatic statistics (Express + Sequelize)
- Trend chart visualization and summary metrics in the web client

## Calibration & Connectivity (At a Glance)

- Default sensor pin: GPIO 33 (AO → 33, VCC → 3.3V, GND → GND)
- Use read averaging if the signal is noisy; tune `DRY_THRESHOLD` and `WET_THRESHOLD`.
- Store credentials (WiFi, Telegram) in `moisture-sensor/src/config.h` (use `config.example.h` as a reference; don’t publish secrets).

## Security

- Protect the API when exposed publicly (rate limiting, JWT auth, CORS policy).
- Store `JWT_SECRET` securely; rotate tokens when needed.
- Consider IP restrictions and database backups.

## Code References

- Firmware: `moisture-sensor/src/main.cpp`
- Board config: `moisture-sensor/platformio.ini`
- Express app: `server/src/app.js`
- Routes: `server/src/routes/` (auth + logs)
- Controllers: `server/src/controllers/`
- Models: `server/src/models/` (Sequelize)
- Client: `client/src/`

This document focuses on the project overview only. Environment setup and run instructions are intentionally omitted.