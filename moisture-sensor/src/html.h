#ifndef HTML_H
#define HTML_H

const char html_page[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Soil Moisture Monitor</title>
    <style>
      body { font-family: Arial; text-align: center; background: #f2f2f2; }
      h1 { color: #333; }
      .box { background: white; padding: 20px; border-radius: 10px; display: inline-block; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
      .value { font-size: 3em; color: #007BFF; }
    </style>
    <script>
      async function fetchData() {
        const res = await fetch('/readMoisture');
        const data = await res.text();
        document.getElementById('moisture').textContent = data + '%';
      }
      setInterval(fetchData, 2000);
      window.onload = fetchData;
    </script>
  </head>
  <body>
    <h1>🌱 Soil Moisture Monitor</h1>
    <div class="box">
      <div class="value" id="moisture">--%</div>
      <p>Kelembapan Tanah</p>
    </div>
  </body>
</html>
)rawliteral";

#endif
