const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secrets = require('../config/secrets.js');
const Users = require('../models/user-model.js');
const userValidation = require('../middleware/user-validation.js');

router.post('/register', async (req, res) => {
  const user = req.body;
  if (!user.username || !user.password || !user.department)
    res.status(400).json({
      success: false,
      message: `Requests must contain 'username', 'password', and 'department'.`,
    });
  const pass_hash = bcrypt.hashSync(user.password, 10);
  user.password = pass_hash;

  try {
    const newUser = await Users.add(user);
    newUser &&
      res.status(201).json({
        success: true,
        message: `User successfully registered.`,
        newUser,
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Fatal Error.\n${err}`,
    });
  }
});

router.post('/login', userValidation, async (req, res) => {
  try {
    const { username } = req.body;
    const user = await Users.findBy({ username }).first();
    const token = genToken(user);
    // req.session.loggedIn = true;
    // req.session.user = { username: user.username };
    res.status(200).json({
      success: true,
      message: `Welcome ${user.username}!`,
      token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Fatal Error.\n${err}`,
    });
  }
});

router.delete('/logout', (req, res) => {
  req.session
    ? req.session.destroy((err) => {
        err
          ? res.status(400).json({
              success: false,
              message: `Unable to successfully log out`,
            })
          : res.status(200).json({
              success: true,
              message: `Successfully logged out.`,
            });
      })
    : res.end();
});

module.exports = router;

function genToken(user) {
  const payload = {
    subject: 'user',
    user_id: user.user_id,
  };
  const secret = secrets.AUTH_SECRET;
  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, secret, options);
}
