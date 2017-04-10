/*
    Activate temporary account
*/

module.exports = function(TempAccount, User, Mailer) {

  return function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(412).end();
      return;
    }

    // find account by id in TempAccount collection
    TempAccount.findById(req.params.id, function(err, tempAccount) {

      // handle error
      if (err) next(err);
      // if the target account not exists
      else if (!tempAccount) {
        res.status(404).send("Sorry, we can'f find register information of this account.");
      }
      // if the target account was found
      else {

        // create the new user
        User.create({
          email: tempAccount.email,
          password: tempAccount.password,
          nickName: tempAccount.nickName,
          type: 'user'
        }, function(err, user) {

          // handle error
          if (err) next(err);
          else {

            // remove the temporary account
            tempAccount.remove();

            // redirect to activated page
            res.render('activated');
          }
        });
      }
    });

  };
};
