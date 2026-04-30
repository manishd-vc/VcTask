import { useState } from 'react';

// components
import { data as fallbackData } from './data';
// slides data
// mui
import { Stack } from '@mui/material';
import CustomHeroSlider from 'src/components/carousels/customHeroSlider';

export default function Hero() {
  const [val] = useState(fallbackData);
  return (
    <Stack direction="column" gap={2}>
      <CustomHeroSlider data={val} />
    </Stack>
  );
}
