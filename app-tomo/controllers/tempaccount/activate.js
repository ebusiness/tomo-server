/*
    Activate temporary account
*/

module.exports = function(TempAccount, User, Mailer) {

  return function(req, res, next) {

    // find account by id in TempAccount collection
    TempAccount.findOne({
      _id: req.params.id,
      type: 'user'
    }, function(err, tempAccount) {

      // handle error
      if (err) next(err);
      // if the target account not exists
      else if (!tempAccount) res.redirect('/');
      // if the target account was found
      else {

        // create the new user
        User.create({
          email: tempAccount.email,
          password: tempAccount.password,
          firstName: tempAccount.firstName,
          lastName: tempAccount.lastName,
          type: tempAccount.type,
          provider: 'local'
        }, function(err, user) {

          // handle error
          if (err) next(err);
          else {

            // remove the temporary account
            tempAccount.remove();

            // send notification to administrator
            User.find()
              .select('email')
              .where('type').equals('admin')
              .where('logicDelete').equals(false)
              .exec(function(err, admins) {
                // // send new-user mail
                // Mailer.newUser(admins, {
                //   id: user._id,
                //   name: user.firstName + ' ' + user.lastName
                // });
              });

            // // log activity
            // Activity.create({
            //     _owner: user._id,
            //     type: 'user-activated'
            // }, function(err, activity) {
            //     if (err) next(err);
            // });

            // // index user in solr
            // solr.add(user.toSolr(), function(err, solrResult) {
            //     if (err) next(err);
            //     else {
            //         console.log(solrResult);
            //         solr.commit(function(err,res){
            //            if(err) console.log(err);
            //            if(res) console.log(res);
            //         });
            //     }
            // });

            // redirect to home page
            res.redirect('/');
          }
        });
      }

    });

  };

};