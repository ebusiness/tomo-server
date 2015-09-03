module.exports = function(User) {

	return function(req, res, next){

		User.find({
			_id: {$ne: req.user.id},
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
