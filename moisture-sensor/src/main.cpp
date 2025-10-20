#include <WiFi.h>
#include <HTTPClient.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include "html.h"
#include "config.h"

int sensor_analog = 0;
float _moisture = 0;
bool isDry = false;

AsyncWebServer server(80);

void sendTelegram(String message)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    String url = "https://api.telegram.org/bot" + String(BOT_TOKEN) +
                 "/sendMessage?chat_id=" + String(CHAT_ID) +
                 "&text=" + message;

    http.begin(url);
    int httpResponseCode = http.GET();
    http.end();

    Serial.print("Telegram sent: ");
    Serial.println(httpResponseCode);
  }
  else
  {
    Serial.println("WiFi not connected, cannot send Telegram message.");
  }
}

void sendToLaravel(float moisture)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(LARAVEL_API_URL + String("/moisture/log"));
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "Bearer " + String(API_TOKEN));

    String jsonBody = "{\"moisture_level\": " + String(moisture, 2) + "}";
    int httpResponseCode = http.POST(jsonBody);

    if (httpResponseCode > 0)
    {
      Serial.print("Laravel response code: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println("Response: " + response);
    }
    else
    {
      Serial.print("Error sending to Laravel: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
  else
  {
    Serial.println("WiFi not connected, cannot send data to Laravel.");
  }
}

void setup()
{
  Serial.begin(SERIAL_BAUDRATE);
  delay(1000);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("✅ Connected to WiFi!");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(200, "text/html", html_page); });

  server.on("/readMoisture", HTTP_GET, [](AsyncWebServerRequest *request)
            { request->send(200, "text/plain", String(_moisture)); });

  server.begin();
  Serial.println("🌐 Async web server started");
}

unsigned long lastSend = 0;
unsigned long lastSensorRead = 0;

void loop()
{
  unsigned long now = millis();

  if (now - lastSensorRead >= 500)
  {
    sensor_analog = analogRead(SENSOR_PIN);
    _moisture = 100 - ((sensor_analog / 4095.0) * 100);

    Serial.print("Raw: ");
    Serial.print(sensor_analog);
    Serial.print(" | Moisture: ");
    Serial.print(_moisture);
    Serial.println("%");

    lastSensorRead = now;
  }

  if (now - lastSend >= SEND_INTERVAL)
  {
    sendToLaravel(_moisture);
    lastSend = now;
  }

  if (_moisture < DRY_THRESHOLD && !isDry)
  {
    sendTelegram("⚠️ Tanah terlalu kering! Kelembapan: " + String(_moisture) + "%");
    isDry = true;
  }

  if (_moisture > WET_THRESHOLD && isDry)
  {
    sendTelegram("✅ Tanah sudah kembali lembap! Kelembapan: " + String(_moisture) + "%");
    isDry = false;
  }
}
