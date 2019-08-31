const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

module.exports = (req, res, next) => {
  const tokenHeader = req.headers.authorization;

  if (tokenHeader) {
    const tokenStrings = tokenHeader.split(' ');
    tokenStrings[0].toUpperCase() === 'BEARER' && tokenStrings[1]
      ? jwt.verify(
          tokenStrings[1],
          secrets.AUTH_SECRET,
          (err, decodedToken) => {
            err
              ? res.status(401).json({
                  success: false,
                  message: `Error verifying token.\n${err}`,
                })
              : (req.decodedJwt = decodedToken),
              next();
          },
        )
      : res.status(401).json({
          success: false,
          message: `Invalid scheme, or no token after scheme name.`,
        });
  } else
    res.status(401).json({
      success: false,
      message: `Missing 'Authorization' header`,
    });
};
