// server.js
const WebSocket = require('ws');
const fetch = require('node-fetch');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    const city = message.toString();
    fetchWeather(city, ws);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

function fetchWeather(city, ws) {
  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
    .then((response) => response.json())
    .then((geoData) => {
      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude } = geoData.results[0];
        return fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
      } else {
        throw new Error('City not found');
      }
    })
    .then((response) => response.json())
    .then((data) => {
      ws.send(JSON.stringify(data));
    })
    .catch((error) => {
      ws.send(JSON.stringify({ error: error.message }));
    });
}

console.log('WebSocket server is running on ws://localhost:8080');