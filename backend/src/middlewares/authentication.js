const jwt = require('jsonwebtoken');

const authenticateToken = (req,res,next)=>{
  // const token = req.cookies.accessToken;
  console.log(req.headers);
  

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


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