import { GoogleOAuthProvider, MicrosoftOAuthProvider } from "@/lib/providers";

const providers = [
  {
    id: "google",
    name: "Google",
    icon: GoogleIcon,
    provider: GoogleOAuthProvider,
  },
  {
    id: "microsoft",
    name: "Microsoft",
    icon: MicrosoftIcon,
    provider: MicrosoftOAuthProvider,
  },
]; 