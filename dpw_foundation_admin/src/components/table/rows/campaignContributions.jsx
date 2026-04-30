import { Chip, Stack, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const CampaignContributions = ({ contributions }) => {
  if (!contributions || contributions.length === 0) {
    return '0';
  }

  const [firstItem, ...remainingItems] = contributions;

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {/* Display the first item */}
      <Typography variant="body2" noWrap>
        {firstItem.targetQuantity} {firstItem.inKindItem}
      </Typography>

      {/* Check if there are more items */}
      {remainingItems.length > 0 && (
        <Tooltip
          arrow
          title={
            <Stack spacing={1}>
              {remainingItems.map((item) => (
                <Typography key={item.id} variant="body2">
                  {item.targetQuantity} ({item.inKindItem})
                </Typography>
              ))}
            </Stack>
          }
        >
          <Chip
            label={`${remainingItems.length} other ${remainingItems.length > 1 ? 'things' : 'thing'}`}
            size="small"
            clickable
          />
        </Tooltip>
      )}
    </Stack>
  );
};

CampaignContributions.propTypes = {
  contributions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      targetQuantity: PropTypes.number.isRequired,
      inKindItem: PropTypes.string.isRequired
    })
  )
};

CampaignContributions.defaultProps = {
  contributions: []
};

export default CampaignContributions;
