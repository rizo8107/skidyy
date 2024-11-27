import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import '../src/styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Add any app-wide effects here
  }, [])

  return <Component {...pageProps} />
}
