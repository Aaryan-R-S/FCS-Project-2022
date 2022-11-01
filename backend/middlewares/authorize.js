const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authorize = (req, res, next) => {
    let verdict = false;
    const token = req.cookies.access_token;
    if (!token) {
      return res.status(403).json({verdict, messages:["Authentication missing! Please login first."]})
    }
    try {
      const data = jwt.verify(token, JWT_SECRET);
      req.userId = data.id;
      return next();
    } catch {
      return res.status(403).json({verdict, messages:["Authentication failed! Please login again."]})
    }
};

module.exports = authorize;