import localFont from 'next/font/local';
// Importing simplebar CSS for custom scrollbar styling
import 'simplebar-react/dist/simplebar.min.css';
// Importing Providers component that wraps the entire app with necessary context/providers
import { GoogleTagManager } from '@next/third-parties/google';
import Script from 'next/script';
import PropTypes from 'prop-types';
import Providers from 'src/providers';
// Loading custom Pilat fonts locally with different font weights and styles
const pilatFonts = localFont({
  src: [
    {
      path: '../../public/fonts/Pilat Light.woff', // Light version of Pilat font
      weight: '300',
      style: 'normal'
    },
    {
      path: '../../public/fonts/Pilat Demi.woff', // Demi version of Pilat font
      weight: '400',
      style: 'normal'
    },

    {
      path: '../../public/fonts/PilatWide-Regular.woff', // Wide Heavy version of Pilat font
      weight: '800',
      style: 'normal'
    },
    {
      path: '../../public/fonts/PilatWide-Bold.woff', // Wide Heavy version of Pilat font
      weight: '700',
      style: 'normal'
    },
    {
      path: '../../public/fonts/Pilat Wide Heavy.woff', // Wide Heavy version of Pilat font
      weight: '600',
      style: 'normal'
    }
  ],
  display: 'swap', // Ensures text remains visible during font loading
  variable: '--font-pilat' // Custom font variable for Pilat font
});

RootLayout.propTypes = {
  // 'children' represents any valid React node (elements, strings, fragments, etc.)
  children: PropTypes.node.isRequired
};
/**
 * Root Layout Component
 *
 * This layout is the root wrapper for the entire app. It sets up global styles,
 * imports required fonts, and wraps the app content with necessary providers
 * for state management and other contexts.
 *
 * The layout ensures that the custom fonts are applied globally,
 * and it provides a consistent structure for all pages.
 */
export default function RootLayout({ children }) {
  return (
    <html lang={'en-US'} style={{ overflow: 'hidden' }} className={`${pilatFonts.variable}`}>
      {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />}
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Usercentrics scripts (must load BEFORE GTM)*/}
        <link rel="preconnect" href="//privacy-proxy.usercentrics.eu" />
        <link rel="preload" href="//privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js" as="script" />
        <Script
          id="usercentrics-cmp"
          src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
          data-ruleset-id="bJGUL9snY0IJZ4"
          async
          strategy="beforeInteractive"
        />
        <Script id="hide-usercentrics-button" strategy="afterInteractive">
          {`
            const interval = setInterval(() => {
              const root = document.querySelector('#usercentrics-root');
              const shadow = root?.shadowRoot;
              const btn = shadow?.querySelector('button[data-testid="uc-privacy-button"]');
              if (btn) {
                btn.style.display = 'none';
                btn.style.visibility = 'hidden';
                btn.style.pointerEvents = 'none';
                clearInterval(interval);
              }
            }, 500);
          `}
        </Script>
        <Script src="https://privacy-proxy.usercentrics.eu/latest/uc-block.bundle.js" strategy="beforeInteractive" />
      </head>
      <body>
        <Providers>
          {children} {/* Render the main app content passed as children */}
        </Providers>
      </body>
    </html>
  );
}
