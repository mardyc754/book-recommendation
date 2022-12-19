import * as Yup from 'yup';
import { Grid, Button, TextField, Stack } from '@mui/material';
import { useFormik } from 'formik';
import PageWrapper from '../components/PageWrapper/PageWrapper';
import PageHeader from 'components/PageHeader';
import { createUser } from 'features/BackendAPI';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(6, 'Username too short')
    .max(28, 'Username too long'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password too short')
    .max(28, 'Password too long'),
  passwordConfirm: Yup.string()
    .required('Password is required')
    .min(6, 'Password too short')
    .max(28, 'Password too long')
});

const Register = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirm: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      const { username, password, passwordConfirm } = values;
      if (password !== passwordConfirm) {
        alert('Passwords do not match');
        return;
      }

      await createUser(username, password)
        .then((res) => {
          alert(`User account for ${res.data.username} created successfully`);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    }
  });

  return (
    <PageWrapper>
      <PageHeader title="Register" />
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
                  focused
                  name="username"
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
                  type="password"
                  focused
                  onChange={formik.handleChange}
                />
                <Grid>
                  <p style={{ color: 'red', fontSize: '12px' }}>
                    {formik.errors.password}
                  </p>
                </Grid>
              </Grid>
              <Grid item xs={1} height="100px">
                <TextField
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  name="passwordConfirm"
                  type="password"
                  focused
                  onChange={formik.handleChange}
                />
                <Grid>
                  <p style={{ color: 'red', fontSize: '12px' }}>
                    {formik.errors.passwordConfirm}
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
