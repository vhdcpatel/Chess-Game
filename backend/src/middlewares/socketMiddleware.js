module.exports.authenticateSocket = (socket, next) => {
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

function verifyToken(token){
  // Verify the token from JWT and return the user object
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}