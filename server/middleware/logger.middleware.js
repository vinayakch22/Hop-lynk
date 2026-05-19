import morgan from 'morgan';

export const requestLogger = () => {
  const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
  return morgan(morganFormat);
};
