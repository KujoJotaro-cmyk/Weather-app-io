let weather = {
  fetchWeather: function (city) {
    fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=" + city
    )
      .then((response) => {
        if (!response.ok) {
          alert("City not found.");
          throw new Error("City not found.");
        }
        return response.json();
      })
      .then((geoData) => {
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          return fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
          ).then((response) => {
            if (!response.ok) {
              alert("No weather found.");
              throw new Error("No weather found.");
            }
            return response.json().then((data) => {
              this.displayWeather(data, city);
            });
          });
        } else {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
      });
  },
  displayWeather: function (data, city) {
    const { temperature, weathercode, windspeed } = data.current_weather;
    const description = this.getWeatherDescription(weathercode);
    const icon = this.getWeatherIcon(weathercode);
    document.querySelector(".city").innerText = "Weather in " + city;
    document.querySelector(".icon img").src = icon;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temperature + "°C";
    document.querySelector(".humidity").innerText = "";
    document.querySelector(".wind").innerText =
      "Wind speed: " + windspeed + " km/h";
    document.querySelector(".weather").classList.remove("loading");

  
    const backgroundVideo = this.getBackgroundVideo(weathercode);
    const videoElement = document.createElement("video");
    videoElement.src = backgroundVideo;
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.classList.add("background-video");

  
    const existingVideo = document.querySelector(".background-video");
    if (existingVideo) {
      existingVideo.remove();
    }

  
    document.body.appendChild(videoElement);
  },
  getWeatherDescription: function (weathercode) {
    const descriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Drizzle: Light",
      53: "Drizzle: Moderate",
      55: "Drizzle: Dense intensity",
      56: "Freezing Drizzle: Light",
      57: "Freezing Drizzle: Dense intensity",
      61: "Rain: Slight",
      63: "Rain: Moderate",
      65: "Rain: Heavy intensity",
      66: "Freezing Rain: Light",
      67: "Freezing Rain: Heavy intensity",
      71: "Snow fall: Slight",
      73: "Snow fall: Moderate",
      75: "Snow fall: Heavy intensity",
      77: "Snow grains",
      80: "Rain showers: Slight",
      81: "Rain showers: Moderate",
      82: "Rain showers: Violent",
      85: "Snow showers: Slight",
      86: "Snow showers: Heavy",
      95: "Thunderstorm: Slight or moderate",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return descriptions[weathercode] || "Unknown weather";
  },
  getWeatherIcon: function (weathercode) {
    const iconMap = {
      0: "01d",
      1: "02d",
      2: "03d",
      3: "04d",
      45: "50d",
      48: "50d",
      51: "09d",
      53: "09d",
      55: "09d",
      56: "13d",
      57: "13d",
      61: "10d",
      63: "10d",
      65: "10d",
      66: "13d",
      67: "13d",
      71: "13d",
      73: "13d",
      75: "13d",
      77: "13d",
      80: "09d",
      81: "09d",
      82: "09d",
      85: "13d",
      86: "13d",
      95: "11d",
      96: "11d",
      99: "11d",
    };
    const iconCode = iconMap[weathercode] || "01d";
    return `http://openweathermap.org/img/wn/${iconCode}.png`;
  },
  getBackgroundVideo: function (weathercode) {
    const videoMap = {
      0: "clear_sky.mp4",
      1: "overcast.mp4",
      2: "overcast.mp4",
      3: "overcast.mp4",
      45: "overcast.mp4",
      48: "overcast.mp4",
      51: "drizzle.mp4",
      53: "drizzle.mp4",
      55: "drizzle.mp4",
      56: "freezing_drizzle.mp4",
      57: "freezing_drizzle.mp4",
      61: "rain.mp4",
      63: "rain.mp4",
      65: "rain.mp4",
      66: "rain.mp4",
      67: "rain.mp4",
      71: "snow.mp4",
      73: "snow.mp4",
      75: "heavy_snow.mp4",
      77: "snow.mp4",
      80: "rain.mp4",
      81: "rain.mp4",
      82: "violent_rain_showers.mp4",
      85: "snow.mp4",
      86: "snow.mp4",
      95: "thunderstorm.mp4",
      96: "thunderstorm.mp4",
      99: "thunderstorm.mp4",
    };
    const backgroundVideo = videoMap[weathercode] || "default_weather.mp4";
    return `/bg/${backgroundVideo}`;
  },
  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });

weather.fetchWeather("Manila");