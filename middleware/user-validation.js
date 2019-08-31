const bcrypt = require('bcrypt');

const Users = require('../models/user-model.js');

module.exports = async function(req, res, next) {
  const { username, password } = req.body;
  // req.session.loggedIn = false;

  if (username && password) {
    try {
      const user = await Users.findBy({ username }).first();
      if (user && bcrypt.compareSync(password, user.password)) next();
      else
        res.status(401).json({
          success: false,
          message: `Invalid Credentials`,
        });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Fatal Error.\n${err}`,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: `no credentials provided.`,
    });
  }
};
