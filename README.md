# Financial calendar app

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/arex95s-projects/v0-financial-calendar-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/keLf3J79uZj)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Google Calendar Integration

This app integrates with Google Calendar to sync financial events. Financial events are identified by a specific format:

### Financial Event Format

**Title Pattern:** `$[AMOUNT] - [DESCRIPTION]`
- Example: `$500 - Compra supermercado`

**Description Pattern:** Structured fields separated by newlines
\`\`\`
Tipo: Gasto|Ingreso
Monto: 500
Moneda: MXNestions 
Categoría: Alimentación
Método de Pago: Tarjeta de Crédito
Notas: [optional]
\`\`\`

### Setup Instructions

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google Calendar API

2. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" user type
   - Fill in the required information
   - Add the scope: `https://www.googleapis.com/auth/calendar`

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://your-domain.com/api/auth/callback/google` (for production)
   - Copy the Client ID and Client Secret

4. **Set Environment Variables**
   - In your Vercel project settings, add:
     - `GOOGLE_CLIENT_ID`: Your OAuth Client ID
     - `GOOGLE_CLIENT_SECRET`: Your OAuth Client Secret
     - `NEXTAUTH_URL`: Your app URL (e.g., `https://your-domain.com`)
     - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`

5. **Deploy**
   - Push changes to trigger a new deployment
   - Sign in with your Google account
   - Grant calendar access permissions

## Deployment

Your project is live at:

**[https://vercel.com/arex95s-projects/v0-financial-calendar-app](https://vercel.com/arex95s-projects/v0-financial-calendar-app)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/projects/keLf3J79uZj](https://v0.app/chat/projects/keLf3J79uZj)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
