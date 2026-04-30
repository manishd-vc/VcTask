// mui
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CommonStyle from './common.styles';

/**
 * LinearIndeterminate Component
 * A simple progress bar that indicates loading progress. This component uses Material UI's LinearProgress component
 * wrapped in a Box container with custom styles.
 *
 * @returns {JSX.Element} A linear progress bar for indicating indeterminate loading.
 */
export default function LinearIndeterminate() {
  const theme = useTheme(); // Access the current theme to style components
  const styles = CommonStyle(theme); // Apply custom styles based on the theme

  return (
    // Box component wraps the LinearProgress to apply custom styles
    <Box sx={styles.loaderStyle}>
      {/* LinearProgress component to show indeterminate progress */}
      <LinearProgress />
    </Box>
  );
}
