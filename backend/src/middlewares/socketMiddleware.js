const jwt = require('jsonwebtoken');

function  authenticationSocket(socket, next){
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication failed.(No token)'));
  }

  const user = verifyToken(token);

  if(!user){
    return next(new Error('Authentication failed.(Invalid token)'));
  }

  socket.user = user;
  return next();
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

module.exports = { authenticationSocket };