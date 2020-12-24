const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const Post = require('../models/post');
const FeedController = require('../controllers/feed');
const dbConfig = require('../config/db');

describe('Feed controller', function () {
	before(function (done) {
		mongoose
			.connect(dbConfig.testConn, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then(result => {
				const user = new User({
					email: 'aa@aa.com',
					password: 'tester',
					name: 'Test',
					posts: [],
					_id: '5fe0f236ff1e582260d83f81',
				});
				return user.save();
			})
			.then(() => {
				done();
			});
	});

	after(function (done) {
		User.deleteMany({})
			.then(() => {
				return mongoose.disconnect();
			})
			.then(() => {
				done();
			});
	});

	beforeEach(() => {});

	afterEach(() => {});

	it('should add a created post to the posts of the creator', function (done) {
		const req = {
			body: {
				title: 'Teste Post',
				content: 'A test post',
			},
			file: {
				path: 'abc',
			},
			userId: '5fe0f236ff1e582260d83f81',
		};
		const res = {
			status: function () {
				return this;
			},
			json: () => {},
		};

		FeedController.createPost(req, res, () => {}).then(savedUser => {
			expect(savedUser).to.have.property('posts');
			expect(savedUser.posts).to.have.length(1);
			done();
		});
	});
});
