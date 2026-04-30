import { Accordion, AccordionDetails, AccordionSummary, IconButton, Tooltip, Typography } from '@mui/material';
import { DropDownArrow, MoreInfoIcon } from './icons';

const CustomAccordion = ({
  accordionTitle,
  handleChange,
  expanded,
  isSupervisor,
  toolTipTitle,
  isUpdate,
  whiteBackground = false,
  children
}) => {
  return (
    <Accordion expanded={expanded} onChange={handleChange} sx={{ py: 2 }}>
      <AccordionSummary
        expandIcon={<DropDownArrow />}
        sx={{ backgroundColor: whiteBackground ? (theme) => theme.palette.background.paper : 'transparent' }}
      >
        <Typography variant={expanded ? 'subtitle5' : 'subtitle4'} color="primary.main" textTransform="uppercase">
          {accordionTitle}
        </Typography>
        {(isSupervisor || isUpdate) && (
          <Tooltip title={toolTipTitle} arrow>
            <IconButton sx={{ m: '-5px 0 0 5px' }}>
              <MoreInfoIcon />
            </IconButton>
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
