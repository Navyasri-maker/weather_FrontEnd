import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  process.env.REACT_APP_WEATHER_API_URL ||
  "https://weather-backend-production-f3d6.up.railway.app/weather";

const popularCities = [
  { name: "Hyderabad", country: "IN" },
  { name: "Delhi", country: "IN" },
  { name: "Mumbai", country: "IN" },
  { name: "Bengaluru", country: "IN" },
  { name: "Chennai", country: "IN" },
  { name: "Visakhapatnam", country: "IN" },
];

function WeatherArtwork({ description = "" }) {
  const isRainy = /rain|drizzle|thunder/i.test(description);
  const isCloudy = /cloud|mist|fog/i.test(description);

  return (
    <svg
      className={`weather-art ${isRainy ? "weather-art-rain" : ""}`}
      viewBox="0 0 320 250"
      role="img"
      aria-label={description ? `Illustration of ${description}` : "Sun and clouds"}
    >
      <circle className="art-orbit art-orbit-one" cx="160" cy="125" r="110" />
      <circle className="art-orbit art-orbit-two" cx="160" cy="125" r="82" />
      <circle
        className={`art-sun ${isCloudy ? "art-sun-muted" : ""}`}
        cx="202"
        cy="82"
        r="39"
      />
      <path
        className="art-cloud-back"
        d="M77 154c-16 0-29-12-29-27 0-14 11-26 26-27 7-22 27-37 51-37 27 0 49 19 53 44 17 1 31 15 31 32 0 18-15 33-34 33H77c-6 0-11-5-11-11s5-7 11-7Z"
      />
      <path
        className="art-cloud"
        d="M91 178c-20 0-36-14-36-32 0-16 13-29 31-31 8-24 31-41 59-41 31 0 56 21 61 49 20 1 36 17 36 37 0 20-18 37-40 37H91c-9 0-16-5-16-11s7-8 16-8Z"
      />
      {isRainy && (
        <g className="art-raindrops">
          <path d="m123 207-6 14M163 207l-6 14M203 207l-6 14" />
        </g>
      )}
      <circle className="art-sparkle" cx="76" cy="77" r="3" />
      <circle className="art-sparkle" cx="254" cy="147" r="4" />
      <circle className="art-sparkle" cx="103" cy="216" r="2.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  );
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("C");
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("weatherHistory")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }, [history]);

  const getWeather = async (searchCity = city) => {
    const searchedCity = searchCity.trim();

    if (!searchedCity) {
      setError("Enter a city to see its forecast.");
      return;
    }

    setCity(searchedCity);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL.replace(/\/$/, "")}/${encodeURIComponent(searchedCity)}`
      );

      if (!response.ok) {
        throw new Error(
          response.status === 404
            ? "We couldn't find that city. Check the spelling and try again."
            : "Weather data is temporarily unavailable. Please try again."
        );
      }

      const data = await response.json();

      if (!data.main || !data.weather?.[0]) {
        throw new Error("The weather service returned an unexpected response.");
      }

      setWeather(data);
      setHistory((previous) =>
        [
          searchedCity,
          ...previous.filter(
            (item) => item.toLowerCase() !== searchedCity.toLowerCase()
          ),
        ].slice(0, 6)
      );
    } catch (requestError) {
      setWeather(null);
      setError(
        requestError.message === "Failed to fetch"
          ? "Can't reach the weather service. Check your connection and try again."
          : requestError.message || "Unable to get weather data."
      );
    } finally {
      setLoading(false);
    }
  };

  const temperature = (value) => {
    if (value == null) return "--";
    const converted = unit === "F" ? (value * 9) / 5 + 32 : value;
    return Math.round(converted);
  };

  const description = weather?.weather?.[0]?.description || "";
  const date = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="SkyCast home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32">
              <path d="M20.9 21.5H10.2a5.2 5.2 0 0 1-.3-10.4A7.1 7.1 0 0 1 23.5 13a4.3 4.3 0 0 1-2.6 8.5Z" />
              <path d="m14.2 23-1.3 3M19.2 23l-1.3 3" />
            </svg>
          </span>
          <span className="brand-name">skycast<span>.</span></span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a className="nav-link nav-link-active" href="#home">Weather</a>
          <a className="nav-link" href="#cities">Explore cities</a>
        </nav>

        <button
          className="unit-switch"
          onClick={() => setUnit(unit === "C" ? "F" : "C")}
          aria-label={`Switch to degrees ${unit === "C" ? "Fahrenheit" : "Celsius"}`}
        >
          <span className={unit === "C" ? "unit-active" : ""}>°C</span>
          <span className="unit-divider">/</span>
          <span className={unit === "F" ? "unit-active" : ""}>°F</span>
        </button>
      </header>

      <main id="home" className="dashboard">
        <section className="intro-row">
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" /> YOUR WEATHER, REIMAGINED</p>
            <h1>A little more <span>sunshine</span><br />in your day.</h1>
            <p className="intro-copy">
              The forecast is looking up. Find the latest conditions wherever
              the day takes you.
            </p>
          </div>
          <div className="date-pill">
            <span className="date-sun" aria-hidden="true">✳</span>
            {date}
          </div>
        </section>

        <section className="search-panel" aria-label="Find weather by city">
          <div className="search-prompt">
            <span className="search-icon"><SearchIcon /></span>
            <div>
              <strong>Find your forecast</strong>
              <span>Pick a city, we'll take it from here.</span>
            </div>
          </div>
          <form
            className="search-form"
            onSubmit={(event) => {
              event.preventDefault();
              getWeather();
            }}
          >
            <label className="visually-hidden" htmlFor="city-search">City name</label>
            <input
              id="city-search"
              type="text"
              placeholder="Try Hyderabad, London, Tokyo..."
              value={city}
              onChange={(event) => setCity(event.target.value)}
              autoComplete="off"
            />
            <button type="submit" disabled={loading}>
              {loading ? <><span className="button-spinner" /> Finding</> : <>Get weather <span aria-hidden="true">↗</span></>}
            </button>
          </form>
        </section>

        {error && (
          <div className="error-message" role="alert">
            <span className="error-mark" aria-hidden="true">!</span>
            <span>{error}</span>
            <button onClick={() => setError("")} aria-label="Dismiss error">×</button>
          </div>
        )}

        {weather ? (
          <section className="weather-section" aria-live="polite">
            <div className="weather-hero">
              <div className="weather-hero-copy">
                <div className="location-label">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  CURRENTLY IN
                </div>
                <h2>
                  {weather.name}
                  {weather.sys?.country ? <span>, {weather.sys.country}</span> : ""}
                </h2>
                <p className="weather-date">{date} <span>·</span> Right now</p>
                <div className="current-reading">
                  <span className="current-temp">{temperature(weather.main?.temp)}</span>
                  <span className="current-unit">°{unit}</span>
                </div>
                <p className="condition">{description}</p>
                <p className="feels-like">Feels like {temperature(weather.main?.feels_like)}°{unit}</p>
              </div>
              <div className="weather-hero-art">
                <WeatherArtwork description={description} />
                <div className="hero-art-caption">
                  <span className="caption-dot" />
                  <span>{description || "A fresh look outside"}</span>
                </div>
              </div>
              <button
                className="refresh-button"
                onClick={() => getWeather(city)}
                disabled={loading}
                aria-label="Refresh weather"
                title="Refresh weather"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 7v5h-5M4 17v-5h5" />
                  <path d="M6.1 9A7 7 0 0 1 18 6.5L20 12M4 12l2 5.5A7 7 0 0 0 17.9 15" />
                </svg>
              </button>
            </div>

            <div className="details-heading">
              <div>
                <p className="eyebrow">THE LITTLE DETAILS</p>
                <h3>Today's conditions</h3>
              </div>
              <span className="details-note">A snapshot of right now</span>
            </div>
            <div className="details-grid">
              <article className="detail-card">
                <span className="detail-symbol humidity-symbol" aria-hidden="true">◉</span>
                <span className="detail-label">Humidity</span>
                <strong>{weather.main?.humidity ?? "--"}<small>%</small></strong>
              </article>
              <article className="detail-card">
                <span className="detail-symbol wind-symbol" aria-hidden="true">↗</span>
                <span className="detail-label">Wind speed</span>
                <strong>{weather.wind?.speed ?? "--"}<small> m/s</small></strong>
              </article>
              <article className="detail-card">
                <span className="detail-symbol pressure-symbol" aria-hidden="true">⌁</span>
                <span className="detail-label">Pressure</span>
                <strong>{weather.main?.pressure ?? "--"}<small> hPa</small></strong>
              </article>
              <article className="detail-card">
                <span className="detail-symbol high-symbol" aria-hidden="true">↑</span>
                <span className="detail-label">High</span>
                <strong>{temperature(weather.main?.temp_max)}<small>°{unit}</small></strong>
              </article>
              <article className="detail-card">
                <span className="detail-symbol low-symbol" aria-hidden="true">↓</span>
                <span className="detail-label">Low</span>
                <strong>{temperature(weather.main?.temp_min)}<small>°{unit}</small></strong>
              </article>
              <article className="detail-card">
                <span className="detail-symbol visibility-symbol" aria-hidden="true">◎</span>
                <span className="detail-label">Visibility</span>
                <strong>
                  {weather.visibility != null
                    ? (weather.visibility / 1000).toFixed(1)
                    : "--"}
                  <small> km</small>
                </strong>
              </article>
            </div>
          </section>
        ) : (
          <section className="welcome-card" aria-live="polite">
            <div className="welcome-card-copy">
              <span className="welcome-kicker">
                <span className="welcome-kicker-dot" />
                {loading ? "JUST A MOMENT" : "A CLEARER KIND OF FORECAST"}
              </span>
              <h2>{loading ? "Looking up the sky..." : "Where to next?"}</h2>
              <p>
                {loading
                  ? "We're gathering the latest conditions for your city."
                  : "Search any city to see what's happening overhead. Your next adventure starts with a forecast."}
              </p>
              {loading ? (
                <div className="loading-track"><span /></div>
              ) : (
                <a className="welcome-link" href="#cities">
                  Explore popular places <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
            <div className="welcome-art-wrap">
              <div className="art-label art-label-top">A GOOD DAY TO LOOK UP</div>
              <WeatherArtwork />
              <div className="art-label art-label-bottom"><span /> Wherever you are</div>
            </div>
            <span className="welcome-decoration welcome-decoration-one" />
            <span className="welcome-decoration welcome-decoration-two" />
          </section>
        )}

        <section id="cities" className="city-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">AROUND THE WORLD</p>
              <h2>Popular places</h2>
            </div>
            <span className="section-aside">A few places to get you started <span aria-hidden="true">↘</span></span>
          </div>
          <div className="city-grid">
            {popularCities.map(({ name, country }, index) => (
              <button
                className={`city-card city-card-${index + 1}`}
                key={name}
                onClick={() => getWeather(name)}
                disabled={loading}
              >
                <span className="city-card-number">0{index + 1}</span>
                <span className="city-card-name">{name}</span>
                <span className="city-card-country">{country}</span>
                <span className="city-card-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </section>

        {history.length > 0 && (
          <section className="history-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">BACK FOR ANOTHER LOOK</p>
                <h2>Recently explored</h2>
              </div>
              <button className="text-button" onClick={() => setHistory([])}>
                Clear history <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="history-list">
              {history.map((item) => (
                <button
                  className="history-chip"
                  key={item}
                  onClick={() => getWeather(item)}
                  disabled={loading}
                >
                  <span className="history-chip-dot" />{item}<span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <a className="footer-brand" href="#home">skycast<span>.</span></a>
        <span>Look up. Step out.</span>
        <span className="footer-credit">Weather for the wonderfully curious <span aria-hidden="true">✳</span></span>
      </footer>
    </div>
  );
}

export default App;
