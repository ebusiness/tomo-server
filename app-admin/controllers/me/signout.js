module.exports = function(User) {

  return function(req, res, next) {
    req.session.destroy();
    res.json({});
  };
};
