module.exports = function(TempAccount, User, Mailer) {

  return function(req, res, next) {

    // try to find a account by the user applicated account ID
    User.findOne({
      email: req.body.email
    }, function(err, user) {

      // handle error
      if (err) next(err);
      // if a existed account are found, require another ID
      else if (user) res.status(409).end();
      // for valid account ID
      else {
        // save temp account object
        TempAccount.create(req.body, function(err, tempAccount) {
          // handle error
          if (err) {
            if (err.code == 11000) res.status(409).end();
            else next(err);
          } else {

            // send account-activate mail
            Mailer.accountActive({
              id: tempAccount._id,
              email: req.body.email
            });

            console.log("http://user.localhost:8080/activate/" + tempAccount._id);

            // send success singnal
            res.json({});
          }
        });
      }
    });
  };

};