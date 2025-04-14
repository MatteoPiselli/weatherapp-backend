var express = require("express");
var router = express.Router();

const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

// Inscription
router.post("/signup", (req, res) => {
  // check if signup data is valid
  if (!checkBody(req.body, ["name", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  //ckeck if user is already registered
  User.findOne({ email: { $regex: new RegExp(req.body.email, "i") } }).then(
    (data) => {
      console.log(data);
      if (data === null) {
        //user is not registered
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

        newUser.save().then(() => {
          res.json({ result: true });
        });
      } else {
        // user already exist in DB
        console.log("test");
        res.json({ result: false, error: "User already exists" });
      }
    }
  );
});

router.post("/signin", (req, res) => {
  // check if signin data is valid
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  User.findOne({
    email: { $regex: new RegExp(req.body.email, "i") },
    password: { $regex: new RegExp(req.body.password, "i") },
  }).then((data) => {
    console.log(data);
    if (data) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

module.exports = router;
