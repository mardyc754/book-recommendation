import Image from 'next/image';
import styles from '../styles/Home.module.css';
import PageWrapper from '../components/PageWrapper/PageWrapper';
import { FormControlLabel, TextField, Button, Stack } from '@mui/material';

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
