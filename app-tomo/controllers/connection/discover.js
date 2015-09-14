module.exports = function(User) {

	return function(req, res, next){

		// do not include user's friends, invited people, and user self
		var exclude = req.user.friends.concat(req.user.invitations, req.user.id)

		User.find({
			_id: {$nin: exclude},
			nickName: new RegExp('^'+req.query.nickName+'$', "i")
		}, 'nickName firstName lastName photo cover birthDay gender telNo address bio', function(err, users) {
	    	if (err) next(err);
				else if (users.length === 0) {
					var err = new Error('Not Found');
					err.status = 404;
					next(err);
				} else res.json(users);
		});

	};
};
