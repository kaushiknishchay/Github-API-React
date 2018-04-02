// eslint-disable-next-line import/prefer-default-export
export function sentryExtra(txt) {
  return {
    extra: {
      error_origin: txt,
    },
  };
}
