'use client';
import { useRouter } from 'next-nprogress-bar';

// mui
import { Button } from '@mui/material';
// api
// icons
// components
import AuthThemeStyles from 'src/app/auth/auth.theme.styles';
import ActivateAccountForm from 'src/components/forms/activateAccount';
import { BackArrow } from 'src/components/icons';

export default function ActivateAccountMain() {
  const router = useRouter();
  return (
    <>
      <Button
        sx={AuthThemeStyles.backButton}
        size="large"
        startIcon={<BackArrow />}
        onClick={() => router.push('/auth/login')}
      >
        Back
      </Button>
      <ActivateAccountForm onSent={() => router.push('/auth/login')} />
    </>
  );
}
