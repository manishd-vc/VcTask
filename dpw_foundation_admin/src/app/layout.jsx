// import { GoogleTagManager } from '@next/third-parties/google';
import localFont from 'next/font/local';
import PropTypes from 'prop-types';
import 'simplebar-react/dist/simplebar.min.css';
import Providers from 'src/providers';

const pilatFonts = localFont({
  src: [
    {
      path: '../../public/fonts/Pilat Light.woff',
      weight: '300',
      style: 'normal'
    },
    {
      path: '../../public/fonts/Pilat Demi.woff',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/Pilat Wide Heavy.woff',
      weight: '600',
      style: 'normal'
    }
  ],
  display: 'swap',
  variable: '--font-pilat'
});

RootLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default function RootLayout({ children }) {
  return (
    <html lang={'en-US'} className={`${pilatFonts.variable}`} style={{ overflow: 'hidden' }}>
      {/* {process.env.NEXT_PUBLIC_GTM_ID && <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />} */}
      <body>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
