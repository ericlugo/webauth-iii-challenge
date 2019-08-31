const express = require('express');

const Users = require('../models/user-model.js');
const restrictedAccess = require('../middleware/access-restriction');

const router = express.Router();

router.get('/', restrictedAccess, async (req, res) => {
  try {
    const users = await Users.find();
    users
      ? res.status(200).json({
          success: true,
          message: `User retrieval successful.`,
          users,
        })
      : res.status(400).json({
          success: false,
          message: `User retrieval unsuccessful.`,
        });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Fatal Error.\n${err}`,
    });
  }
});

router.get('/:id', restrictedAccess, async (req, res) => {
  try {
    const user = await Users.find(req.params.id);
    user
      ? res.status(200).json({
          success: true,
          message: `User retrieval successful.`,
          user,
        })
      : res.status(400).json({
          success: false,
          message: `User retrieval unsuccessful.`,
        });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Fatal Error.\n${err}`,
    });
  }
});

module.exports = router;
