module.exports = function(TempAccount, User, Mailer) {

  return function(req, res, next) {

    // try to find a account by the user applicated account ID
    User.findOne({
      email: req.body.email
    }, function(err, user) {

      // handle error
      if (err) next(err);
      // if a existed account are found, require another ID
      else if (user) {
        var err = new Error('The Email Address Is Already In Use');
        err.status = 409;
        next(err);
      }
      // for valid account ID
      else {
        // save temp account object
        TempAccount.create(req.body, function(err, tempAccount) {
          // handle error
          if (err) next(err);
          else {

            // send account-activate mail
            Mailer.accountActive({
              id: tempAccount._id,
              email: req.body.email
            });

            console.log("http://localhost:81/activate/" + tempAccount._id);

            // send success singnal
            res.json({});
          }
        });
      }
    });
  };

};
