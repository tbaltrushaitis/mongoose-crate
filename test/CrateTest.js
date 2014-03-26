var should = require("should"),
	path = require("path"),
	os = require("os"),
	fs = require("fs"),
	sinon = require("sinon"),
	tungus = require("tungus"),
	mongoose = require("mongoose"),
	async = require("async"),
	randomString = require("./fixtures/randomString"),
	Crate = require("../lib/Crate"),
	createSchema = require("./fixtures/StubSchema"),
	createSchemaWithArrayProperty = require("./fixtures/StubSchemaWithArrayProperty");

describe("Crate", function() {

	before(function(done) {
		var dataDirectory = path.join(os.tmpdir(), randomString(10));
		fs.mkdirSync(dataDirectory);
		mongoose.connect("tingodb://" + dataDirectory);

		done();
	})

	it("should attach a file", function(done) {
		var file = path.resolve(__dirname + "/./fixtures/node_js_logo.png");

		createSchema(function(StubSchema) {
			var model = new StubSchema();
			model.attach("file", {
				path: file
			}, function (error) {
				should(error).not.ok;

				done();
			});
		});
	})

	it("should attach a file to an array", function(done) {
		var file = path.resolve(__dirname + "/./fixtures/node_js_logo.png");

		createSchemaWithArrayProperty(function(StubSchema) {
			var model = new StubSchema();

			model.files.length.should.equal(0);
			model.attach("files", {
				path: file
			}, function (error) {
				should(error).not.ok;

				model.files.length.should.equal(1);

				done();
			});
		});
	})

	it("should error on non attachment field", function(done) {
		var file = path.resolve(__dirname + "/./fixtures/node_js_logo.png");

		createSchema(function(StubSchema) {
			var model = new StubSchema();
			model.attach("foo", {
				path: file
			}, function (error) {
				error.should.be.ok;

				done();
			});
		});
	})

	it("should error when attachment path is missing", function(done) {
		createSchema(function(StubSchema) {
			var model = new StubSchema();
			model.attach("file", {}, function (error) {
				error.should.be.ok;

				done();
			});
		});
	})

	it("should error on non-existent file", function(done) {
		var file = path.resolve(__dirname + "/./fixtures/foo.png");

		createSchema(function(StubSchema) {
			var model = new StubSchema();
			model.attach("file", {
				path: file
			}, function(error) {
				error.should.be.ok;

				done();
			});
		});
	})

	it("should remove attachment when model is deleted", function(done) {
		var file = path.resolve(__dirname + "/./fixtures/node_js_logo.png");

		createSchema(function(StubSchema, storage) {
			var model = new StubSchema();
			model.attach("file", {
				path: file
			}, function(error) {
				should(error).not.ok;

				storage.remove.callCount.should.equal(0);

				model.remove();

				storage.remove.callCount.should.equal(1);

				done();
			});
		});
	})

	it("should remove attachment array when model is deleted", function(done) {
		var file = path.resolve(__dirname + "/./fixtures/node_js_logo.png");

		createSchemaWithArrayProperty(function(StubSchema, storage) {
			var model = new StubSchema();
			model.attach("files", {
				path: file
			}, function(error) {
				should(error).not.ok;

				model.attach("files", {
					path: file
				}, function(error) {
					should(error).not.ok;

					storage.remove.callCount.should.equal(0);

					model.remove();

					storage.remove.callCount.should.equal(2);

					done();
				});
			});
		});
	})
/*
	it("should remove attachment when model is updated", function(done) {
		var file = path.resolve(__dirname + "/./fixtures/node_js_logo.png");

		createSchema(function(StubSchema, storage) {
			var model = new StubSchema();
			var tasks = [function(callback) {
				// create our model and attach a file
				model.name = "hello";
				model.attach("file", {
					path: file
				}, callback);
			}, function(callback) {
				// save the model
				model.save(callback);
			}, function(callback) {
				// load a new copy of the model
				model.id.should.be.ok;

				StubSchema.findById(model.id, function(error, result) {
					// should not be the same object
					(model === result).should.be.false;

					// but the ids should be the same
					model.id.should.equal(result.id);
					model = result;

					callback(error);
				});
			}, function(callback) {
				// overwrite the file property
				model.attach("file", {
					path: file
				}, callback);
			}, function(callback) {
				// and save the model again
				model.save(callback);
			}];

			async.series(tasks, function(error) {
				should(error).not.ok;

				// should have removed the old attachment
				storage.remove.callCount.should.equal(1);

				// and stored the old and new ones
				storage.save.callCount.should.equal(2);

				done();
			});
		});
	});*/
})
