import helmet from 'helmet';

export const securityHeaders = () =>
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });
