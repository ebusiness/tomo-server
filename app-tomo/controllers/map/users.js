module.exports = function(User) {

	return function(req, res, next){

		var query = User.find();

		query.select('nickName firstName lastName photo cover birthDay gender telNo address bio primaryGroup')
			.where('primaryGroup').exists(true)
      .where('_id').ne(req.user.id)
			.where('logicDelete').equals(false)
			.populate('primaryGroup')
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
