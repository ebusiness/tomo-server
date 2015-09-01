// User logout

module.exports = function() {

  return function(req, res, next) {
    req.session.destroy();
    res.json({});
  };

};