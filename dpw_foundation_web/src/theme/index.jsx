'use client';
// Import necessary libraries and components
import { usePathname } from 'next/navigation'; // To get the current path
import PropTypes from 'prop-types'; // Prop types validation
import { useSelector } from 'src/redux'; // To access the redux store

// mui
import CssBaseline from '@mui/material/CssBaseline'; // Base CSS reset
import * as locales from '@mui/material/locale'; // Material UI locales
import { createTheme, ThemeProvider } from '@mui/material/styles'; // Theme creation and provider

// emotion
import createCache from '@emotion/cache'; // Emotion cache for styling
import { CacheProvider } from '@emotion/react'; // Cache provider for emotion styles

// stylis
import { prefixer } from 'stylis'; // Stylis prefixer
import rtlPlugin from 'stylis-plugin-rtl'; // RTL plugin for stylis

// custom theme
import breakpoints from './breakpoints'; // Custom breakpoints
import componentsOverride from './overrides'; // Custom component overrides
import palette from './palette'; // Custom color palette
import shadows, { customShadows } from './shadows'; // Custom shadows
import shape from './shape'; // Custom shape properties
import typography from './typography'; // Custom typography settings

// PropTypes validation
ThemeRegistry.propTypes = {
  children: PropTypes.node.isRequired // Children must be a node
};

// Localization function to map language to Material UI locale
const Localization = (lang) => {
  switch (lang) {
    case 'ar':
      return 'arEG'; // Arabic locale
    case 'fr':
      return 'frFR'; // French locale
    case 'en':
      return 'enUS'; // English locale
    default:
      return 'frFR'; // Default to French locale
  }
};

export default function ThemeRegistry({ children }) {
  // Get the theme mode from redux store
  const { themeMode } = useSelector((state) => state.settings);

  // Get the current path and extract the language
  const pathName = usePathname();
  const segments = pathName?.split('/');
  const lang = segments[1]; // Extract the language from the URL
  const locale = Localization(lang); // Get the locale based on the language
  const dir = lang === 'ar' ? 'rtl' : 'ltr'; // Set text direction based on language

  // Create cache for emotion styles
  const styleCache = createCache({
    key: dir === 'rtl' ? 'muirtl' : 'css', // Set cache key based on direction
    stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : [] // Add RTL plugin if necessary
  });

  // Custom theme creation
  const customTheme = () =>
    createTheme(
      {
        palette: themeMode === 'dark' ? { ...palette.dark, mode: 'dark' } : { ...palette.light, mode: 'light' }, // Set dark or light palette
        direction: dir, // Set text direction (ltr or rtl)
        typography: typography, // Use custom typography settings
        shadows: themeMode === 'dark' ? shadows.dark : shadows.light, // Set shadows based on theme mode
        shape, // Apply custom shape settings
        breakpoints, // Apply custom breakpoints
        customShadows: themeMode === 'dark' ? customShadows.light : customShadows.dark // Apply custom shadows based on theme mode
      },
      locales[locale] // Apply locale-specific settings
    );

  return (
    <CacheProvider value={styleCache}>
      <ThemeProvider theme={{ ...customTheme(), components: componentsOverride(customTheme()) }}>
        <main dir={dir} style={{ height: '100%' }}>
          <CssBaseline />
          {children}
        </main>
      </ThemeProvider>
    </CacheProvider>
  );
}
