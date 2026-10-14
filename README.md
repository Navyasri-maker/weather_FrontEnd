# SkyCast frontend

## Run with the local backend

1. Start the Spring Boot backend from `weather_backend/weather_backend` on
   port `8080`. Configure its MySQL connection settings and `WEATHER_API_KEY`
   as described in the backend README.
2. In this directory, run `npm start`.

The frontend calls `http://localhost:8080/weather` by default. For local
development, the backend's `WEATHER_CORS_ORIGIN` default permits cross-origin
requests.

## Deploy on Vercel

1. Import the `Navyasri-maker/weather_FrontEnd` GitHub repository into Vercel.
   The included `vercel.json` configures the Create React App build and output.
2. In the Vercel project's Environment Variables, set
   `REACT_APP_WEATHER_API_URL` to the Railway backend's public URL followed by
   `/weather` (for example, `https://your-backend.up.railway.app/weather`).
3. Deploy or redeploy the Vercel project.
4. Set the backend's Railway `WEATHER_CORS_ORIGIN` variable to the deployed
   Vercel origin (for example, `https://your-app.vercel.app`) and redeploy the
   backend.

The frontend variable is embedded at build time. Redeploy Vercel whenever the
backend URL changes. Do not add API or database credentials to frontend
variables or source code.

## Available scripts

- `npm start` starts the development server.
- `npm test -- --watchAll=false` runs the tests once.
- `npm run build` creates an optimized production build.
