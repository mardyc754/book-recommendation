import { Stack } from '@mui/material';

const PageHeader = ({ title }: { title: string }): JSX.Element => {
  return (
    <Stack>
      <Stack sx={{ padding: '24px' }} alignItems="center" justifyItems="center">
        <h2>{title}</h2>
      </Stack>
    </Stack>
  );
};

export default PageHeader;
