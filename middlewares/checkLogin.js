const checkLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/users/login");
  }
  console.log(req.user);
  next();
};

export default checkLogin;
