export default function Divider(theme) {
  return {
    MuiDivider: {
      variants: [
        {
          props: { variant: 'customGradient' },
          style: {
            border: 0,
            height: '2px',
            background: theme.palette.gradients.blackOpposite,
            margin: `${theme.spacing(3)} 0`
          }
        }
      ]
    }
  };
}
