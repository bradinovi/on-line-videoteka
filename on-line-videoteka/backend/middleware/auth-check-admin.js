const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token); // convencion is to get "Berare asdadgadgagaretweirjdfohaer"
    const decodedToken = jwt.verify(token,process.env.PASSWORD_SEC); // throws error if it's invalid
    req.userData = { email: decodedToken.email, userId: decodedToken.userId, role: decodedToken.role };
    if(decodedToken.role !== "admin"){
      res.status(401).json({ message: 'Auth failed!' });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ message: 'Auth failed!' });
  }
};
