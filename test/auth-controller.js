const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthCrontroller = require('../controllers/auth');
const dbConfig = require('../config/db');

describe('Auth controller', function () {
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

	it('should throw an error with code 500 if the accessing the database fails', function (done) {
		sinon.stub(User, 'findOne');
		User.findOne.throws();

		const req = {
			body: {
				email: 'aa@aa.com',
				password: 'teste',
			},
		};
		AuthCrontroller.login(req, {}, () => {}).then(result => {
			expect(result).to.be.an('error');
			expect(result).to.have.property('statusCode', 500);
			done();
		});

		User.findOne.restore();
	});

	it('should send a response with a valid user status for a existing user', function (done) {
		const req = {
			userId: '5fe0f236ff1e582260d83f81',
		};
		const res = {
			statusCode: 500,
			userStatus: null,
			status: function (code) {
				this.statusCode = code;
				return this;
			},
			json: function (data) {
				this.userStatus = data.status;
			},
		};
		AuthCrontroller.getUserStatus(req, res, () => {}).then(() => {
			expect(res.statusCode).to.be.equal(200);
			expect(res.userStatus).to.be.equal('I am new!');
			done();
		});
	});
});
