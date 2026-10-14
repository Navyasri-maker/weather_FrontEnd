# SkyCast frontend

## Run the frontend

Run `npm start`. By default, the frontend calls the deployed Railway API at
`https://weather-backend-production-f3d6.up.railway.app/weather`.

To use a local backend instead, start the Spring Boot service from
`weather_backend/weather_backend` on port `8081`, configure its database and
`WEATHER_API_KEY` as described in the backend README, then set
`REACT_APP_WEATHER_API_URL=http://localhost:8081/weather` in a `.env.local`
file before starting the frontend. The backend's local CORS default permits
cross-origin requests.

## Deploy on Vercel

1. Import the `Navyasri-maker/weather_FrontEnd` GitHub repository into Vercel.
   The included `vercel.json` configures the Create React App build and output.
2. The production API URL is configured by default. Alternatively, set
   `REACT_APP_WEATHER_API_URL` in Vercel to the Railway backend's public URL
   followed by `/weather`.
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
