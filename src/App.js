import { useState } from "react";
import "./App.css";

function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getWeather = async () => {

    if (city.trim() === "") {
      setError("Please enter a city name");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {

      const response = await fetch(
        `http://localhost:8080/weather/${city}`
      );

      if (!response.ok) {
        throw new Error("Weather data not found");
      }

      const data = await response.json();

      setWeather(data);

    } catch (error) {
      setError("Unable to get weather data. Check your backend.");
    }

    setLoading(false);
  };

  return (
    <div className="App">

      <header className="weather-header">

        <h1>Smart Weather Forecast</h1>

        <p>
          Get real-time weather information for any city
        </p>

      </header>

      <main className="weather-container">

        <div className="search-box">

          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getWeather();
              }
            }}
          />

          <button onClick={getWeather}>
            Search
          </button>

        </div>

        {loading && (
          <p className="message">
            Loading weather...
          </p>
        )}

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        {weather && (

          <div className="weather-card">

            <h2>
              {weather.name}, {weather.sys?.country}
            </h2>

            <div className="temperature">
              {Math.round(weather.main?.temp)}°C
            </div>

            <p className="condition">
              {weather.weather?.[0]?.description}
            </p>

            <div className="weather-details">

              <div className="detail">
                <p>Feels Like</p>
                <strong>
                  {Math.round(weather.main?.feels_like)}°C
                </strong>
              </div>

              <div className="detail">
                <p>Humidity</p>
                <strong>
                  {weather.main?.humidity}%
                </strong>
              </div>

              <div className="detail">
                <p>Wind Speed</p>
                <strong>
                  {weather.wind?.speed} m/s
                </strong>
              </div>

              <div className="detail">
                <p>Pressure</p>
                <strong>
                  {weather.main?.pressure} hPa
                </strong>
              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default App;