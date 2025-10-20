# Moisture Monitoring

An ESP32-based soil moisture monitoring system (Arduino/PlatformIO firmware) with a Laravel backend API for logging and retrieving data.

Project components:

- `moisture-sensor/` — ESP32 (NodeMCU-32S) firmware that reads the moisture sensor, serves a local web UI, and sends Telegram alerts.
- `server/` — Laravel 12 API to store and fetch moisture logs.

## Prerequisites

- PHP 8.2+, Composer
- MySQL/MariaDB (or SQLite)
- VS Code + PlatformIO extension (for firmware)
- ESP32 board (NodeMCU-32S as set in `platformio.ini`)

## Folder Structure

```
moisture-monitoring/
├─ moisture-sensor/      # ESP32 firmware (Arduino)
│  ├─ src/main.cpp       # Main logic for sensor reading & web server
│  └─ src/config.example.h → copy to config.h and fill in credentials
└─ server/               # Laravel API
   ├─ routes/api.php     # Moisture API endpoints
   └─ app/Http/Controllers/MoistureLogController.php
```

## Quick Start

### 1) Run the Backend API (Laravel)

On Windows (cmd.exe):

```
cd server
composer install
copy .env.example .env
php artisan key:generate
```

Edit the `.env` file and configure your database, for example:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel
DB_USERNAME=root
DB_PASSWORD=
```

Migrate and (optional) seed:

```
php artisan migrate
php artisan db:seed --class=MoistureLogSeeder
```

Start the development server:

```
php artisan serve
```

The app runs at http://127.0.0.1:8000. API endpoints are prefixed with `/api` (see the summary below).

### 2) Flash the ESP32 Firmware

1. Open the `moisture-sensor/` folder in VS Code (with PlatformIO).
2. Copy `src/config.example.h` to `src/config.h` and fill in your WiFi SSID/Password and Telegram credentials.
   - Do not commit your token/ID to a public repo.
3. Connect the ESP32 board (NodeMCU-32S), select the `nodemcu-32s` environment, then Upload.
4. Open the Serial Monitor (115200) to see the device IP.
5. Visit `http://<ESP32-IP>/` for the web UI; moisture data is available at `GET /readMoisture` (plain text, percent).

Note: The firmware does not currently push data to the API automatically. See the API Integration section for a simple POST example.

## Backend API Summary

Prefix: `/api/moisture`

- `POST /log` — stores a single moisture value.
  - JSON body: `{ "moisture_level": 75.5 }`
  - Response (201):
    ```json
    {
      "code": 201,
      "message": "Moisture level logged successfully",
      "data": null
    }
    ```

- `GET /today` — today’s data + stats.
- `GET /three-days` — last 3 days + stats.
- `GET /seven-days` — last 7 days + stats.
- `GET /all-days` — all data + stats.

Sample 200 response:

```json
{
  "code": 200,
  "message": "Moisture logs retrieved successfully",
  "data": {
    "logs": [
      { "id": 1, "moisture_level": 75.5, "created_at": "2025-10-20T12:00:00.000000Z", "updated_at": "2025-10-20T12:00:00.000000Z" }
    ],
    "stats": { "latest": 75.5, "average": 75.5, "min": 75.5, "max": 75.5, "count": 1 }
  }
}
```

Quick test (Windows has curl):

```
curl -X POST http://127.0.0.1:8000/api/moisture/log -H "Content-Type: application/json" -d "{\"moisture_level\": 42.3}"
curl http://127.0.0.1:8000/api/moisture/today
```

## ESP32 → API Integration (optional)

Add this to your loop/interval on the ESP32 firmware to send data to the server (simple example):

```cpp
#include <HTTPClient.h>

void postToApi(float moisture) {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  http.begin("http://<backend-host-or-ip>:8000/api/moisture/log");
  http.addHeader("Content-Type", "application/json");
  String payload = String("{\"moisture_level\": ") + String(moisture, 1) + "}";
  int code = http.POST(payload);
  http.end();
}
```

Call `postToApi(_moisture);` at your chosen interval (e.g., every 30–60 seconds) and consider retry/backoff.

## Security & Tips

- Keep credentials in `moisture-sensor/src/config.h` (don’t commit them publicly). Use `config.example.h` as the public template.
- Restrict API access (IP whitelisting, auth tokens, or Laravel Sanctum) if exposed to the internet.
- Calibrate your sensor; default formula: `moisture% = 100 - ((analog/4095.0) * 100)`.

## Quick References

- Firmware: `moisture-sensor/src/main.cpp`
- Board config: `moisture-sensor/platformio.ini` (env: `nodemcu-32s`)
- API endpoints: `server/routes/api.php`

---

## Firmware Details (ESP32)

### Features

- Local web UI with live moisture percent
- Plain-text data endpoint at `GET /readMoisture`
- Telegram alerts on threshold crossings (dry → wet and wet → dry)

### Hardware

- Board: ESP32 NodeMCU-32S
- Sensor: analog soil moisture sensor
  - AO → GPIO 33 (default `SENSOR_PIN`)
  - VCC → 3.3V (check your sensor’s requirements)
  - GND → GND

### Reading Formula and Calibration

`moisture% = 100 - ((analog / 4095.0) * 100)` for 12-bit ADC range. Adjust thresholds and mapping to match your sensor if readings look off.

### Telegram Notifications

- Configure `BOT_TOKEN` and `CHAT_ID` in `src/config.h`
- Alerts are sent when moisture crosses configured thresholds:
  - Below `DRY_THRESHOLD` → send dry warning once
  - Above `WET_THRESHOLD` after being dry → send recovery message

### Troubleshooting

- WiFi won’t connect: verify SSID/password, distance to AP, and power supply
- Moisture reading stuck or noisy: check wiring, pin assignment, and sensor quality; consider averaging multiple reads
- Telegram not sent: verify internet, token/chat id, and Bot API limits
- Upload fails: check correct COM port and use a data-capable USB cable

---

## Server Details (Laravel)

### Database Schema

Table `moisture_logs` (see `server/database/migrations/2025_10_20_105940_create_moisture_logs_table.php`):

- `id` bigint PK
- `moisture_level` float
- `created_at`, `updated_at` timestamps

### Useful Commands

```
php artisan migrate
php artisan serve
php artisan test
```

On Windows you can also format code if Pint is present:

```
vendor\bin\pint.bat
```

### Testing

The repository includes a Pest test setup. Run:

```
php artisan test
```

### Production & Security

- Serve via Nginx/Apache + PHP-FPM
- Set `APP_ENV=production`, `APP_DEBUG=false`
- Consider authentication (e.g., Laravel Sanctum) if exposing the API publicly
- Add rate limiting and CORS policy as required
- Backup your database regularly

---

This repository now consolidates documentation in this root README to keep it single-source and up-to-date.

