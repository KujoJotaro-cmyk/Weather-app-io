
const map = L.map('map').setView([51.505, -0.09], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


function addRadarLayer() {
  const radarLayer = L.tileLayer('https://tilecache.rainviewer.com/v2/radar/{z}/{x}/{y}/256/{time}/0_0.png', {
    attribution: '&copy; <a href="https://www.rainviewer.com">RainViewer</a>',
    maxZoom: 10,
    opacity: 0.5,
    time: Date.now() 
  });

  radarLayer.addTo(map);
}


addRadarLayer();

function updateRadarLayer() {
  const currentTime = Date.now();
  radarLayer.setParams({ time: currentTime });
}


setInterval(updateRadarLayer, 300000); 


const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', function (event) {
  console.log('Connected to WebSocket server');
});

socket.addEventListener('message', function (event) {
  const data = JSON.parse(event.data);
  if (data.error) {
    alert(data.error);
  } else {
    const city = document.querySelector('.search-bar').value;
    weather.displayWeather(data, city);


    const { latitude, longitude } = data.current_weather;
    map.setView([latitude, longitude], 10); 
  }
});

socket.addEventListener('close', function (event) {
  console.log('Disconnected from WebSocket server');
});

weather.search = function () {
  const city = document.querySelector('.search-bar').value;
  socket.send(city);
};

document.querySelector('.search button').addEventListener('click', function () {
  weather.search();
});

document.querySelector('.search-bar').addEventListener('keyup', function (event) {
  if (event.key == 'Enter') {
    weather.search();
  }
});