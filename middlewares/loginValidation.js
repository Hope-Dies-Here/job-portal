import { body, validationResults } from 'express-validator';

const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Email is not valid, please check your email address again"),
  body("password")
    .isLength({ min: 4 })
    .withMessage("Password must at least 4 letters"),

  (req, res, next) => {
    const errors = validationResults(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      console.log(errors.array());
      return res.redirect("/register");
    }
    next();
  },
];

export default regValidation;
