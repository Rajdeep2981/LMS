exports.userAuth = (req, res, next) => {
  if (req.session.eno && req.session.loggedin) {
    return next();
  }
  return res.redirect("/");
};

exports.adminAuth = (req, res, next) => {
  if (req.session.admin && req.session.name) {
    return next();
  }
  res.redirect("/admin");
};
