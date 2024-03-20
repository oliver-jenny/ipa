import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { AuthenticationErrors } from './authentication-errors.ts';
import { useTranslation } from 'react-i18next';
import { isAuthenticated, login } from '@repo/switch-api/authentication';
import { useNavigate } from 'react-router-dom';
import { sanitize } from '../../utils/string-sanitizer.ts';

export default function Authentication() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [usernameError, setUsernameHasError] = useState<
    AuthenticationErrors | undefined
  >();
  const [passwordError, setPasswordHasError] = useState<
    AuthenticationErrors | undefined
  >();
  const [credentialsError, setCredentialsError] = useState<
    AuthenticationErrors | undefined
  >();

  useEffect(() => {
    const checkAuthentication = async () => {
      if (await isAuthenticated()) {
        return navigate('/');
      }
    };

    checkAuthentication();
  }, [navigate]);

  const onSubmit = async (event: {
    preventDefault: () => void;
    currentTarget: HTMLFormElement | undefined;
  }) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = sanitize(String(data.get('username')));
    const password = sanitize(String(data.get('password')));

    !username
      ? setUsernameHasError(AuthenticationErrors.USERNAME_MISSING)
      : setUsernameHasError(undefined);
    !password
      ? setPasswordHasError(AuthenticationErrors.PASSWORD_MISSING)
      : setPasswordHasError(undefined);

    if (password && username) {
      const response = await login(username, password);

      if (response?.ok) {
        if (await isAuthenticated()) {
          setCredentialsError(undefined);
          return navigate('/');
        } else {
          setCredentialsError(AuthenticationErrors.WRONG_CREDENTIAL);
        }
      } else {
        setCredentialsError(AuthenticationErrors.WRONG_CREDENTIAL);
      }
    }
  };

  return (
    <Box
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        px: 4,
        py: 6,
        marginTop: 30,
        display: 'flex',
        justifyContent: 'center',
        width: { xs: 'auto', md: 'auto', lg: 600 },
        maxHeight: '25%',
        flexDirection: 'column',
      }}
      component="form"
      noValidate
      onSubmit={onSubmit}
    >
      <Typography component="h1" variant="h5">
        {t('auth.authentication')}
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label={t('auth.input.username')}
        name="username"
        title="username"
        autoFocus
        error={!!usernameError || !!credentialsError}
        helperText={usernameError && t(usernameError)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        type="password"
        id="password"
        title="password"
        label={t('auth.input.password')}
        name="password"
        error={!!passwordError || !!credentialsError}
        helperText={passwordError && t(passwordError)}
      />
      <Button type="submit" title="submit">
        {t('auth.input.submit')}
      </Button>
      {credentialsError && (
        <FormHelperText error sx={{ maxWidth: 600 }}>
          {credentialsError && t(credentialsError)}
        </FormHelperText>
      )}
    </Box>
  );
}
