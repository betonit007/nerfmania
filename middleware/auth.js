const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  
    //Get token from header
    const token = req.header('x-auth-token');
    
    if(!token) {
        return res.status(401).json({ msg: 'Authorization denied'})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_PASSWORD);
        
        req.user = decoded.id;
        next();

    } catch (error) {
      res.status(401).json({ msg: 'Token is not valid'})
    }
}