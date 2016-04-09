
var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Expense = require('../models/expenses');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var superSecret = 'geheimnis';

/* GET users listing. */
router.get('/', function(req, res) {
	res.json({
		message: 'Hallo, es funktioniert!'
	});
});

router.post('/authenticate', function(req, res) {
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user) {
		if (err) throw err;
		if (!user) {
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		} else if (user) {
			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword) {
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});
			} else {
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
					expiresInMinutes: 1440 //24h
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
});


router.use(function(req, res, next) {
    console.log('Anfrage an die API');
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, superSecret, function (err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
        
    // next();
});

router.get('/me', function (req, res) {
    res.send(req.decoded);
});

router.route('/users')

.post(function(req, res) {
	var user = new User();
	user.name = req.body.name;
	user.username = req.body.username;
	user.password = req.body.password;

	user.save(function(err) {
		if (err) {
			if (err.code == 11000)
				return res.json({
					success: false,
					message: 'A user with that username already exists. '
				});
			else return res.send(err)
		}
		res.json({
			message: 'User created!'
		});
	});
})

.get(function(req, res) {
	User.find(function(err, users) {
		if (err) res.send(err);
		res.json(users);
	});
});

router.route('/users/:user_id')

.put(function(req, res) {
	User.findById(req.params.user_id, function(err, user) {
		if (err) res.send(err);
		if (req.body.name) user.name = req.body.name;
		if (req.body.username) user.name = req.body.username;
		if (req.body.password) user.password = req.body.password;
		user.save(function(err) {
			if (err) res.send(err);
			res.json({
				message: 'User updated!'
			});
		});
	});
})

.get(function(req, res) {
	User.findById(req.params.user_id, function(err, user) {
		if (err) res.send(err);
		res.json(user);
	});
})

.delete(function(req, res) {
	User.remove({
		_id: req.params.user_id
	}, function(err, user) {
		if (err) return res.send(err);
		res.json({
			message: 'Successfully deleted'
		});
	});
});


router.route('/expenses')

.post(function(req, res) {
	var expense = new Expense();
	expense.date = req.body.date;
	expense.content = req.body.content;
	expense.merchant = req.body.merchant;
	expense.categories = req.body.categories;
	expense.amount = req.body.amount;

	expense.save(function(err) {
		if (err) {
			if (err.code == 11000)
				return res.json({
					success: false,
					message: 'A user with that username already exists. '
				});
			else return res.send(err)
		}
		res.json({
			message: 'User created!'
		});
	});
})

.get(function(req, res) {
	Expense.find(function(err, expenses) {
		if (err) res.send(err);
		res.json(expenses);
	});
});

router.route('/expenses/:expense_id')

.put(function(req, res) {
	Expense.findById(req.params.expense_id, function(err, expense) {
		if (err) res.send(err);
		if (req.body.date) expense.date = req.body.date;
		if (req.body.content) expense.content = req.body.content;
		if (req.body.merchant) expense.merchant = req.body.merchant;
		if (req.body.categories) expense.categories = req.body.categories;
		if (req.body.amount) expense.amount = req.body.amount;

		expense.save(function(err) {
			if (err) res.send(err);
			res.json({
				message: 'User updated!'
			});
		});
	});
})

.get(function(req, res) {
	Expense.findById(req.params.expense_id, function(err, expense) {
		if (err) res.send(err);
		res.json(expense);
	});
})

.delete(function(req, res) {
	Expense.remove({
		_id: req.params.expense_id
	}, function(err, expense) {
		if (err) return res.send(err);
		res.json({
			message: 'Successfully deleted'
		});
	});
});

module.exports = router;
