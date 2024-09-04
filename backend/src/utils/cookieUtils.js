const setAccessTokenCookie = (res, token) => {
  res.cookie('accessToken', token, {
    httpOnly: true,
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
    secure: process.env.NODE_ENV === 'production',
    // sameSite: 'None'
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    path: '/',
  });
};

module.exports = setAccessTokenCookie;