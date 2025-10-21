# Moisture Monitoring

An ESP32-based soil moisture monitoring system using Arduino/PlatformIO firmware, a Laravel backend API for logging and retrieval, and a simple web client (React + Vite) for visualization.

## Overview

- The ESP32 device reads an analog soil moisture sensor and exposes a local UI and simple endpoints on the local network.
- Moisture readings can be sent to the Laravel backend to be logged and aggregated into basic statistics (latest, average, min, max, count).
- The web client renders trend charts and summary cards (daily/periodic) using API data.

## Architecture

1) Sensor → ESP32: periodic ADC reading and moisture percentage calculation.
2) ESP32 → API (optional): push moisture values to the backend endpoint.
3) Laravel API: store logs and serve aggregated/statistical data.
4) Web Client: fetch from API for visualization (line chart + summary).

## Project Components

- `moisture-sensor/` (ESP32 Firmware)
  - Board: NodeMCU-32S (ESP32)
  - Features: local UI, `GET /readMoisture` endpoint, Telegram notifications on dry/wet threshold crossings.
  - Default reading formula (12-bit ADC): `moisture% = 100 - ((analog / 4095.0) * 100)` — calibrate as needed for your sensor.

- `server/` (Laravel 12 Backend)
  - Persists moisture logs and provides periodic data + statistics.
  - Main table: `moisture_logs` (columns: `id`, `moisture_level`, `created_at`, `updated_at`).

- `client/` (React + Vite)
  - Simple dashboard: line chart (trend) and summary cards (stats).
  - Consumes API endpoints from the backend.

## Backend API Summary

Prefix: `/api/moisture`

- `POST /log` — store a single moisture value (`{ "moisture_level": <float> }`).
- `GET /today` — today’s data + stats.
- `GET /three-days` — last 3 days + stats.
- `GET /seven-days` — last 7 days + stats.
- `GET /all-days` — all data + stats.

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

## Top-level Folder Structure

```
moisture-monitoring/
├─ moisture-sensor/      # ESP32 firmware (Arduino/PlatformIO)
│  ├─ src/main.cpp       # Sensor reading logic & local web server
│  └─ src/config.example.h  # Credentials template (WiFi/Telegram)
├─ server/               # Laravel backend (moisture API)
│  ├─ routes/api.php     # API endpoint definitions
│  └─ app/Models/MoistureLog.php
└─ client/               # Web client (React + Vite)
   └─ src/               # UI components (chart, stats)
```

## Key Features

- Read soil moisture from an analog sensor (ESP32)
- On-device local UI + `GET /readMoisture` endpoint
- Telegram notifications on dry/wet thresholds (configurable)
- Backend logging with automatic statistics
- Trend chart visualization and summary metrics in the web client

## Calibration & Connectivity (At a Glance)

- Default sensor pin: GPIO 33 (AO → 33, VCC → 3.3V, GND → GND)
- Use read averaging if the signal is noisy; tune `DRY_THRESHOLD` and `WET_THRESHOLD`.
- Store credentials (WiFi, Telegram) in `moisture-sensor/src/config.h` (use `config.example.h` as a reference; don’t publish secrets).

## Security

- Protect the API when exposed publicly (rate limiting, auth tokens, or Sanctum).
- Consider CORS policy, IP restrictions, and database backups.

## Code References

- Firmware: `moisture-sensor/src/main.cpp`
- Board config: `moisture-sensor/platformio.ini`
- API endpoints: `server/routes/api.php`
- Model: `server/app/Models/MoistureLog.php`
- Client: `client/src/`

This document focuses on the project overview only. Environment setup and run instructions are intentionally omitted.