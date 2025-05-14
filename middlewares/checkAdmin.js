const checkAdmin = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect("/admin/login");
  }
  
  next();
};

export default checkAdmin;
