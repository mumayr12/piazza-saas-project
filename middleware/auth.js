const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({ msg: "No token, authorization denied" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Access Denied" });
      }

      req.user = user;

      next();
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: "Token is not valid" });
  }
};

module.exports = authenticateToken;
