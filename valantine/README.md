# Valentine App

This project is built with React + Vite (valantine) and an Express server (server).

## Deployment Instructions

To run this application in production:

1. **Build the Client:**
   Navigate to the `valantine` directory and run:
   ```bash
   cd valantine
   npm install
   npm run build
   ```
   This will generate a `dist` folder containing the production-ready frontend code.

2. **Start the Server:**
   Navigate to the `server` directory and run:
   ```bash
   cd ../server
   npm install
   npm start
   ```
   The server is configured to serve the static files from `../valantine/dist`.

## Configuration

Ensure your `.env` file in `server` includes the correct `FRONTEND_URL` (e.g., `https://your-domain.com`). The server will automatically use this to generate sharing links.

## Troubleshooting

- If you see `SyntaxError: Unexpected token '<'`, ensure the `valantine` folder has been built successfully and the `dist` folder exists.
- If styles are missing, recreate the `dist` folder by running the build command again.
