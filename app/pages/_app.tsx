import type { AppProps } from 'next/app'
import { GoogleOAuthProvider } from '@react-oauth/google'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <Component {...pageProps} />
    </GoogleOAuthProvider>
  )
} 