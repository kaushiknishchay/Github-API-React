import { isTokenSaved, sentryExtra } from '../utils';

describe('Utils Tests', () => {
  it('should return SentryExtra function output', () => {
    const txt = 'error message';
    const sentryObj = sentryExtra(txt);
    expect(sentryObj).toEqual({
      extra: {
        error_origin: txt,
      },
    });
  });

  it('should return false, isTokenSaved() ', () => {
    const isSaved = isTokenSaved();
    expect(isSaved).toBeFalsy();
  });

  it('should return true, isTokenSaved()', () => {
    // set a random token value in localStorage
    localStorage.setItem('auth-token', '098f6bcd4621d373cade4e832627b4f6');
    const isSaved = isTokenSaved();
    expect(isSaved).toBeTruthy();
  });
});
