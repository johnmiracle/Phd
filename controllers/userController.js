const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/User");

exports.memberRegister = async (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const address = req.body.address;
  const audience = req.body.audience;
  const isAdmin = req.body.isAdmin;

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    req.flash("danger", "email is already registered, Please login");
    res.redirect("/login");
  }

  check("firstName", "First name is required").notEmpty();
  check("lastName", "Last name is required").notEmpty();
  check("email", "email is required").isEmail();
  check("phone", "Mobile Number is required").notEmpty();
  check("password", "Passsword is required")
    .trim()
    .notEmpty()
    .isLength({ min: 6 });
  check("address", "Address is required").notEmpty();

  let err = validationResult(req.body);

  if (!err.isEmpty()) {
    return res.flash({ err: err });
  } else {
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      address,
      audience
    });
    bcrypt.hash(user.password, 10, (err, hash) => {
      user.password = hash;
      user.save(function(err) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Registration is successfull, Please Login");
          res.redirect("/login");
        }
        (req, res, next) => {
          if (req.session.oldUrl) {
            const oldUrl = req.session.oldUrl;
            req.session.oldUrl = null;
            res.redirect(oldUrl);
          }
        };
      });
    });
  }
};
exports.memberHome = (req, res, next) => {
  res.render("userHome");
};

exports.memberProfile = (req, res, next) => {
  res.render("memberProfile");
};

exports.memberProfileEdit = (req, res, next) => {
  res.render("profile-edit");
};

exports.order_page = (req, res, next) => {
  res.render("orders_page");
};

exports.view_order = (req, res, next) => {
  res.render("order");
};