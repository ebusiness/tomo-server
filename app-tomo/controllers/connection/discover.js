module.exports = function(User) {

	return function(req, res, next){

		// do not include user's friends, invited people, and user self
		var exclude = req.user.friends.concat(req.user.invitations, req.user.id);

		var query = User.find();

		if (req.query.nickName)
			query.where('nickName').regex(new RegExp('^.*?'+req.query.nickName+'.*$', "i"));

		query.select('nickName firstName lastName photo cover birthDay gender telNo address bio primaryStation')
			.populate('primaryStation')
			.where('_id').nin(exclude)
			.where('logicDelete').equals(false)
			.exec(function(err, users) {
	    	if (err) next(err);
				else if (users.length === 0) {
					var err = new Error('Not Found');
					err.status = 404;
					next(err);
				} else res.json(users);
			});

		// User.find({
		// 	_id: {$nin: exclude},
		// 	nickName: new RegExp('^'+req.query.nickName+'$', "i")
		// }, 'nickName firstName lastName photo cover birthDay gender telNo address bio', function(err, users) {
	  //   	if (err) next(err);
		// 		else if (users.length === 0) {
		// 			var err = new Error('Not Found');
		// 			err.status = 404;
		// 			next(err);
		// 		} else res.json(users);
		// });

	};
};
