## Installation

- 1/ Add `.env`:
```bash
cd app
cp .env.example .env
```

- 2/ Store `API Key` informations into `.env`:
  - `Supabase's APY Key` can be get from here: https://supabase.com/
  - `Google Client ID` can be get from here: https://console.cloud.google.com/auth/clients 
    - `Authorized Javascript Origins`: `localhost:3000`
    - `Authorized redirect URIs`: `localhost:3000/auth/callback`
```bash
# This file contains environment variables for a Next.js application using Supabase. (https://supabase.com/)
NEXT_PUBLIC_SUPABASE_URL="Your Supabase URL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="Your Supabase Anon Key"

# This file contains environment variables for a Next.js application using Google OAuth. (https://developers.google.com/identity/protocols/oauth2)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="Your Google Client ID"
```


- 3/ Run the frontend:
```bash
cd app
npm run dev
```

- 4/ Open UI on web browser:
```bash
http://localhost:3000
```