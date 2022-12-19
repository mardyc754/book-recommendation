import Link from 'next/link';
import { TextField, Button, Stack, Grid } from '@mui/material';
import PageWrapper from '../components/PageWrapper/PageWrapper';
import PageHeader from 'components/PageHeader';

const Login = () => {
  return (
    <PageWrapper>
      <Stack>
        <PageHeader title="Log in" />
        <Stack sx={{ alignItems: 'center' }}>
          <Stack sx={{ boxShadow: '5px 5px 20px #aaa', padding: '32px' }}>
            <form
            // onSubmit={formik.handleSubmit}
            >
              <Grid container spacing={4} columns={1} sx={{ display: 'grid' }}>
                <Grid item xs={1}>
                  <TextField
                    label="Username"
                    placeholder="Username"
                    name="username"
                    focused
                    fullWidth
                    // onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <TextField
                    label="Password"
                    placeholder="Password"
                    name="password"
                    focused
                    fullWidth
                    type="password"
                    // onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={1}>
                  <Button
                    variant="contained"
                    fullWidth
                    type="submit"
                    sx={{ textTransform: 'none' }}
                  >
                    Log in
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Stack>
        </Stack>
      </Stack>
    </PageWrapper>
  );
};

export default Login;
