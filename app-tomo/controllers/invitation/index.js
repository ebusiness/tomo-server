module.exports = function(User) {

	return function(req, res, next){

    if (!req.user.invitations) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
      return;
    }

		User.find({
			_id: {$in: req.user.invitations}
		}, 'nickName firstName lastName photo cover birthDay gender telNo address bio', function(err, users) {
    	if (err) next(err);
			else res.json(users);
		});

	};
};
