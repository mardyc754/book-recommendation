import * as Yup from 'yup';
import { useFormik } from 'formik';
import { TextField, Button, Stack, Grid } from '@mui/material';

import { handleLoginSubmit } from 'features/formHandlers';
import PageWrapper from '../components/PageWrapper/PageWrapper';
import PageHeader from 'components/PageHeader';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(6, 'Username too short')
    .max(28, 'Username too long'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password too short')
    .max(28, 'Password too long')
});

const Login = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: ''
    },
    validationSchema,
    onSubmit: handleLoginSubmit
  });

  return (
    <PageWrapper>
      <Stack>
        <PageHeader title="Log in" />
        <Stack sx={{ alignItems: 'center' }}>
          <Stack
            sx={{
              boxShadow: '5px 5px 20px #aaa',
              padding: '32px',
              marginBottom: '32px'
            }}
          >
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={4} columns={1} sx={{ display: 'grid' }}>
                <Grid item xs={1} height="100px">
                  <TextField
                    label="Username"
                    placeholder="Username"
                    name="username"
                    focused
                    fullWidth
                    onChange={formik.handleChange}
                  />
                  <Grid>
                    <p style={{ color: 'red', fontSize: '12px' }}>
                      {formik.errors.username}
                    </p>
                  </Grid>
                </Grid>
                <Grid item xs={1} height="100px">
                  <TextField
                    label="Password"
                    placeholder="Password"
                    name="password"
                    focused
                    fullWidth
                    type="password"
                    onChange={formik.handleChange}
                  />
                  <Grid>
                    <p style={{ color: 'red', fontSize: '12px' }}>
                      {formik.errors.password}
                    </p>
                  </Grid>
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
