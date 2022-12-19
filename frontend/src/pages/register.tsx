import { Grid, Button, TextField, Stack } from '@mui/material';
import PageWrapper from '../components/PageWrapper/PageWrapper';
import PageHeader from 'components/PageHeader';

const Register = () => {
  return (
    <PageWrapper>
      <PageHeader title="Register" />
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
                  focused
                  name="username"
                  // onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  label="Password"
                  placeholder="Password"
                  name="password"
                  type="password"
                  focused
                  // onChange={formik.handleChange}
                />
              </Grid>
              <Grid item xs={1}>
                <TextField
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  name="passwordConfirm"
                  type="password"
                  focused
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
                  Register
                </Button>
              </Grid>
            </Grid>
          </form>
        </Stack>
      </Stack>
    </PageWrapper>
  );
};

export default Register;
