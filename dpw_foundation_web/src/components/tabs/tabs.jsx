'use client';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * CustomTabs component - A reusable tab component that synchronizes the selected tab
 * with the URL and allows dynamic content display based on the active tab.
 *
 * @param {object} props - The properties passed to the component.
 * @param {Array} props.tabs - Array of tab objects, each containing `value`, `label`, and `content`.
 * @param {string} props.defaultValue - The default tab value to show when there is no query parameter in the URL.
 *
 * @returns {JSX.Element} The rendered tab component.
 */
export default function CustomTabs({ tabs, defaultValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || defaultValue;
  const [value, setValue] = useState(initialTab);

  useEffect(() => {
    // Sync the state with the tab from the URL
    setValue(initialTab || defaultValue);
    router.push(`?tab=${initialTab || defaultValue}`);
  }, [initialTab, defaultValue]);

  /**
   * Handles the tab change event and updates the URL and state with the new tab value.
   *
   * @param {object} event - The event object triggered by the tab change.
   * @param {string} newValue - The new tab value to be set.
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(`?tab=${newValue}`);
  };

  return (
    <TabContext value={value}>
      <Box sx={{ mb: 1 }}>
        <TabList
          onChange={handleChange}
          TabIndicatorProps={{ style: { display: 'none' } }}
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabs?.map((tab) => (
            <Tab key={tab?.value} label={tab?.label} value={tab?.value} />
          ))}
        </TabList>
      </Box>
      {tabs?.map((tab) => (
        <TabPanel key={tab?.value} value={tab?.value}>
          {tab?.content}
        </TabPanel>
      ))}
    </TabContext>
  );
}

CustomTabs.propTypes = {
  // Validating 'tabs' as an array of objects with 'value' and 'label' properties
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired, // 'value' must be a required string
      label: PropTypes.string.isRequired // 'label' must be a required string
    })
  ).isRequired,

  // Validating 'defaultValue' as a required string
  defaultValue: PropTypes.string.isRequired
};
