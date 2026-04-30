import { Typography } from '@mui/material';
import { useEffect, useRef } from 'react';

export default function MobilePaymentStatus({ soTransactionID, paymentStatus, message }) {
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (!paymentStatus || typeof window === 'undefined') return;
    if (hasRedirectedRef.current) return;

    hasRedirectedRef.current = true;

    const isAndroid = /android/i.test(navigator.userAgent);
    const statusPath = paymentStatus === 'SUCCESS' ? 'success' : 'failed';

    const queryParam = `?soTransactionID=${soTransactionID}`;

    const redirectUrl = `dpwfoundation://${statusPath}${queryParam}`;

    const intentUrl = `intent://${statusPath}${queryParam}#Intent;scheme=dpwfoundation;package=com.dpw.foundation.app;end`;

    window.location.href = isAndroid ? intentUrl : redirectUrl;
  }, [paymentStatus, soTransactionID]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h4" component="h1">
        {message}
      </Typography>
    </div>
  );
}
