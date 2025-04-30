const checkLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/users/login");
  }

  next();
};

export default checkLogin;
