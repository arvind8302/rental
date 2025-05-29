const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const passport = require("passport");
const ExpressError = require("../utils/ExpressError");
const { userSchema } = require("../schema");
const { route } = require("./listing");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupform)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.login
  );

router.get("/logout", userController.logout);

module.exports = router;
