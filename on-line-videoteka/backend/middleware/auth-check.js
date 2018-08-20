const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token); // convencion is to get "Berare asdadgadgagaretweirjdfohaer"
    const decodedToken = jwt.verify(token,'S7vrly7NDuMZ_R8MdDRGDddtY3iIvJ0wS7S-fgh0syUSDg3CLT9G4BqUESRRPp0YNnYQuFV6uOgbux_9CVop9cejRzJfwEGFnbaSN7QPQFAYogSar5Hrjqqnayrgs_764VrozPfpFGZeIejnuItx9x8Z8VB9uhB2vzi35co9-jmUn1KxxkmQB2-BNrjH9pf0kNJSjX4277IrYn1FOjRk-bdK3kR1ylQePgiTmzqsOXXXpVjktigYXcSRX4J_x4kP44wPKuA4w2QZHfIqo5Q_m607TlNfhuc87nLw1zhphVWYGC5DI7F7tTrfuYijvJLydMMj3XAbaW7CDcrRm5D45Q'); // throws error if it's invalid
    req.userData = { email: decodedToken.email, userId: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth failed!' });
  }
};
