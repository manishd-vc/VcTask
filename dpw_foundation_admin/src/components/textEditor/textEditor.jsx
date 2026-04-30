import { Paper, Typography } from '@mui/material';
import JoditEditor from 'jodit-react';
import PropTypes from 'prop-types';
import { useMemo, useRef } from 'react';
import './joEditor.css';

export default function TextEditor({ setLatterValues, latterValues, title, paperSx }) {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      placeholder: 'Enter your content here...',
      readonly: false,
      paste: {
        HTMLInsertMode: 'insert_as_html'
      }
    }),
    []
  );

  return (
    <Paper sx={{ padding: 3, marginY: 3, ...paperSx }} elevation={2}>
      {title && (
        <Typography variant="h6" textTransform={'uppercase'} color="primary.main" aria-label="Editor Title" pb={3}>
          {title}
        </Typography>
      )}
      <JoditEditor
        ref={editor}
        value={latterValues}
        config={config}
        tabIndex={0}
        onBlur={(newContent) => setLatterValues(newContent)}
        onChange={(newContent) => {}}
      />
    </Paper>
  );
}

// Define PropTypes for type checking
TextEditor.propTypes = {
  setLatterValues: PropTypes.func.isRequired,
  latterValues: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};
