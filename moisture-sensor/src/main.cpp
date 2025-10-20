#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include "html.h"
#include "config.h"

int sensor_analog = 0;
int _moisture = 0;
bool isDry = false;

WebServer server(80);

void sendTelegram(String message)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    String url = "https://api.telegram.org/bot" + String(BOT_TOKEN) + "/sendMessage?chat_id=" + String(CHAT_ID) + "&text=" + message;
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

void MainPage()
{
  server.send(200, "text/html", html_page);
}

void SoilMoisture()
{
  server.send(200, "text/plain", String(_moisture));
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
  Serial.println("Connected to WiFi!");
  Serial.print("Local IP: ");
  Serial.println(WiFi.localIP());

  server.on("/", MainPage);
  server.on("/readMoisture", SoilMoisture);
  server.begin();

  Serial.println("Web server started");
}

void loop()
{
  sensor_analog = analogRead(SENSOR_PIN);
  _moisture = 100 - ((sensor_analog / 4095.0) * 100);

  Serial.print("Raw: ");
  Serial.print(sensor_analog);
  Serial.print(" | Moisture: ");
  Serial.print(_moisture);
  Serial.println("%");

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

  server.handleClient();
  delay(1000);
}
