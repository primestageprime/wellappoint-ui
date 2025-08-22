# Appointed UI

A SolidJS frontend for the Appointed appointment booking system with Auth0 Google social authentication.

## Features

- 🔐 Auth0 authentication with Google social login
- 📱 Responsive design with Tailwind CSS
- 🚀 Single page application with SolidJS
- 🔄 Real-time service data from backend API
- 📄 JSON display of available services

## Prerequisites

- Node.js 18+ 
- Your backend server running on `localhost:8000`
- Auth0 account with Google social connection configured

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Auth0:**
   - Create an Auth0 application
   - Enable Google social connection
   - Copy your domain and client ID
   - Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. **Update environment variables:**
   ```env
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_AUDIENCE=your-api-audience
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

## Development

- **Dev server:** `npm run dev`
- **Build:** `npm run build`
- **Preview build:** `npm run preview`

## Architecture

- **SolidJS** for reactive UI components
- **Auth0** for authentication with Google OAuth
- **Vite** for fast development and building
- **Tailwind CSS** for styling (utility classes)
- **TypeScript** for type safety

## API Integration

The app proxies API requests to your backend server running on `localhost:8000`. The main endpoint used is:

- `GET /api/services` - Fetches available services

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your hosting provider

3. Update Auth0 callback URLs for production

## Backend Requirements

Ensure your backend server (appointed) is running and accessible at `http://localhost:8000` with the following endpoint:

- `GET /services` - Returns JSON array of services with `name`, `duration`, and `price` fields
