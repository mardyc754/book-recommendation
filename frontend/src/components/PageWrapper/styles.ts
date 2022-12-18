import { styled } from '@mui/system';
import {
  Button as MUIButton,
  ButtonProps as MUIButtonProps
} from '@mui/material';

export const HeaderButton = styled(MUIButton)<MUIButtonProps>({
  textTransform: 'unset',
  margin: '8px'
});
