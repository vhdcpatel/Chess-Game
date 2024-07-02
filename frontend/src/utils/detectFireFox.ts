const isFirefox =(): boolean => {
  return typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent);
};

export default isFirefox;