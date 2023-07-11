import { Box, Text, styled } from '@ignite-ui/react';

export const From = styled(Box, {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '$2',
  marginTop: '$4',
  padding: '$4',

  '@media(max-width: 600px)': {
    gridTemplateColumns: '1fr',
  },
});

export const FormAnnotation = styled('div', {
  marginTop: '$2',

  [`> ${Text}`]: {
    color: '$gray400',
  },
});
