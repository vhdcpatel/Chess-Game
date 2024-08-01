// utils/jwtUtils.js
const jwt = require('jsonwebtoken');

const signToken = (user) => {
  const token = jwt.sign(
    { user },
    process.env.ACCESS_TOKEN_JWT,
    { expiresIn: '2d' }
  );
  return token;
};

module.exports = { signToken };
