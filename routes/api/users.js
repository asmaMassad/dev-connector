const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// load user model
const User = require("../../models/User");
//@route    get route api/users/test
//@desc     test users route
//@access   public
router.get("/test", (req, res) => res.json({ msg: "usersworks" }));

//@route    post route api/users/register
//@desc     register user
//@access   public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", // rating
        d: "mm" //default image if no avatar is found
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user).catch(err => console.log(err)));
        });
      });
    }
  });
});

//@route    get route api/users/login
//@desc     login user/ returning jwt token
//@access   public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  //find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "user email not found";
      return res.status(404).json(errors);
    }
    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //res.json({msg: "success"})
        //user matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 43200 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route    get route api/users/current
//@desc     return current user
//@access   private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ msg: "success" });
  }
);

module.exports = router;
