#ifndef CONFIG_H
#define CONFIG_H

// --- WIFI CONFIG ---
#define WIFI_SSID ""     // Change to your WiFi SSID
#define WIFI_PASSWORD "" // Change to your WiFi Password

// --- TELEGRAM CONFIG ---
#define BOT_TOKEN "" // Change to your Telegram Bot Token
#define CHAT_ID ""   // Change to your Telegram Chat ID

// --- EXPRESS API CONFIG ---
#define EXPRESS_API_URL "" // Change to your Express API URL
#define JWT ""             // JWT token for Express API authentication

// --- SEND INTERVAL ---
#define SEND_INTERVAL 1000 // Interval to send data to Express (in milliseconds)

// --- SENSOR CONFIGURATION ---
#define SENSOR_PIN 33    // Pin ADC for humidity sensor
#define DRY_THRESHOLD 30 // Lower threshold (%)
#define WET_THRESHOLD 40 // Upper threshold (%)

// --- SERIAL CONFIG ---
#define SERIAL_BAUDRATE 115200

#endif