import { OAuthProvider } from "./types";

export const GoogleOAuthProvider: OAuthProvider = {
  id: "google",
  name: "Google",
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
  scope: "email profile",
};

export const MicrosoftOAuthProvider: OAuthProvider = {
  id: "microsoft",
  name: "Microsoft",
  clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID || "",
  clientSecret: process.env.MICROSOFT_CLIENT_SECRET || "",
  authorizationUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
  tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
  userInfoUrl: "https://graph.microsoft.com/v1.0/me",
  scope: "user.read",
}; 