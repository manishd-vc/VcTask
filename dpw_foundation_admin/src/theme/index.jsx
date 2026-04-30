'use client';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import { useSelector } from 'src/redux';

// mui
import CssBaseline from '@mui/material/CssBaseline';
import * as locales from '@mui/material/locale';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// emotion
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

// stylis
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';

// custom theme
import breakpoints from './breakpoints';
import componentsOverride from './overrides';
import palette from './palette';
import shadows, { customShadows } from './shadows';
import shape from './shape';
import typography from './typography';

/**
 * PropTypes validation for ThemeRegistry component.
 * @typedef {Object} ThemeRegistryProps
 * @property {React.ReactNode} children - The children components rendered inside ThemeRegistry.
 */

/**
 * Function to localize the language based on the provided language code.
 * @param {string} lang - The language code (e.g., 'en', 'ar', 'fr').
 * @returns {string} The corresponding locale for the language.
 */
const Localization = (lang) => {
  switch (lang) {
    case 'ar':
      return 'arEG';
    case 'fr':
      return 'frFR';
    case 'en':
      return 'enUS';
    default:
      return 'frFR'; // Default locale if language is not found
  }
};

/**
 * ThemeRegistry component to provide custom theme and localization for the app.
 * @param {ThemeRegistryProps} props - The props for the ThemeRegistry component.
 * @returns {JSX.Element} The ThemeRegistry wrapped around the children.
 */
export default function ThemeRegistry({ children }) {
  // Retrieve the theme mode (light or dark) from the Redux store
  const { themeMode } = useSelector((state) => state.settings);

  // Get the current pathname and extract language from the URL
  const pathName = usePathname();
  const segments = pathName?.split('/');
  const lang = segments[1];

  // Determine the locale and text direction (rtl/ltr) based on the language
  const locale = Localization(lang);
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  // Create a custom cache to handle RTL/LTR styling with Emotion
  const styleCache = createCache({
    key: dir === 'rtl' ? 'muirtl' : 'css', // Cache key for RTL or LTR
    stylisPlugins: dir === 'rtl' ? [prefixer, rtlPlugin] : [] // Apply RTL plugin if needed
  });

  // Create the custom theme based on theme mode and direction
  const customTheme = () =>
    createTheme(
      {
        palette: themeMode === 'dark' ? { ...palette.dark, mode: 'dark' } : { ...palette.light, mode: 'light' },
        direction: dir, // Set text direction (RTL or LTR)
        typography: typography,
        shadows: themeMode === 'dark' ? shadows.dark : shadows.light,
        shape,
        breakpoints,
        customShadows: themeMode === 'dark' ? customShadows.light : customShadows.dark
      },
      locales[locale] // Apply the locale for the theme
    );

  return (
    <CacheProvider value={styleCache}>
      {' '}
      {/* Provide the Emotion cache */}
      <ThemeProvider theme={{ ...customTheme(), components: componentsOverride(customTheme()) }}>
        <main dir={dir} style={{ height: '100%' }}>
          <CssBaseline /> {/* Normalize CSS */}
          {children} {/* Render the children components */}
        </main>
      </ThemeProvider>
    </CacheProvider>
  );
}

// Validate prop types for the ThemeRegistry component
ThemeRegistry.propTypes = {
  children: PropTypes.node.isRequired // Children must be a React node
};
