const jwt = require('jsonwebtoken');

const authenticateToken = (req,res,next)=>{
  // const token = req.cookies.accessToken;
  console.log(req.headers.cookie);
  

  const cookieHeader = req.headers['cookie'];
  let token = null;

  if (cookieHeader) {
    const cookies = cookieHeader.split('; ');
    const accessTokenCookie = cookies.find(cookie => cookie.startsWith('accessToken='));
    if (accessTokenCookie) {
      token = accessTokenCookie.split('=')[1];
    }
  }

  if(!token){
    return res.status(401).json({message: "No token, authorization denied."})
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = authenticateToken;