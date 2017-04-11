module.exports = function(User) {

	return function(req, res, next){

		// do not include user's following, user self, [and invited people]
		var exclude = req.user.following.concat(req.user.id);

		var query = User.find();

		if (req.query.nickName)
			query.where('nickName').regex(new RegExp('^.*?'+req.query.nickName+'.*$', "i"));

		var size = (req.query.size || 20) * 1;

		query.select('-password -logicDelete -experiences -device')
			.where('_id').nin(exclude)
			.where('logicDelete').equals(false)
			.skip(size * (req.query.page || 0))
			.limit(size)
			.exec(function(err, users) {
	    	if (err) next(err);
				else if (users.length === 0) {
					var err = new Error('Not Found');
					err.status = 404;
					next(err);
				} else res.json(users);
			});
	};
};
