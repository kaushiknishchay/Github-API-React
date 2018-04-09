// eslint-disable-next-line import/prefer-default-export
export function sentryExtra(txt) {
  return {
    extra: {
      error_origin: txt,
    },
  };
}
export function isTokenSaved() {
  const token = localStorage.getItem('auth-token');
  return token !== undefined && token !== null && token !== '';
}
