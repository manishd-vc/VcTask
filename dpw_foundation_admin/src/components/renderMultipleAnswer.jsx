import { Box } from '@mui/material';
import { fDateWithLocale } from 'src/utils/formatTime';

export default function RenderMultipleAnswer({ response, questionType, responseFileName, downloadMediaFile }) {
  if (questionType.toUpperCase() === 'RADIO' || questionType.toUpperCase() === 'CHECKBOX') {
    return response.split(',').join(', ');
  } else if (questionType.toUpperCase() === 'DATE') {
    return fDateWithLocale(response);
  } else if (questionType.toUpperCase() === 'FILE') {
    return responseFileName ? (
      <Box
        component="span"
        sx={{
          textDecoration: responseFileName ? 'underline' : 'none',
          cursor: responseFileName ? 'pointer' : 'default',
          fontWeight: 300
        }}
        onClick={(e) => downloadMediaFile(e, response)}
      >
        {responseFileName}
      </Box>
    ) : (
      '-'
    );
  } else {
    return response;
  }
}
