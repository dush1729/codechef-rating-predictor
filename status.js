var util = require("util");
var async = require("async");
var authenticate = require("./authenticate.js");

var contestid;

var usercollection;
var collection;

function parseStatusPage(contestid, pageno, callback) {

	var url = util.format('https://api.codechef.com/submissions?contestCode=%s&offset=%s&limit=20&fields=username', contestid, pageno * 20);

	authenticate.getBearer((err, result) => {
		if (err) {
			console.log(err)
		} else {
			var accessToken = result["result"]["data"]["access_token"]

			execHttps(url, function (source) {
				if (source.indexOf("API request limit exhausted") != -1) {
					console.log("API request limit exhausted :(")
					// try after 5 minutes
					setTimeout(function () {
						parseStatusPage(contestid, pageno, callback)
					}, 5 * 60 * 1000)
					return
				}

				if (source.indexOf("no submissions found for this search") != -1) {
					// all submissions parsed
					callback()
					return
				}

				var submissions = JSON.parse(source).result.data.content;
				submissions.forEach(submission => {
					try {
						usercollection.update(
							{ contestid: contestid, user: submission.username },
							{ contestid: contestid, user: submission.username },
							{ upsert: true });
					}
					catch (ex) {
					}
				})

				collection.update({ contestid: contestid }, { $set: { pagedone: pageno } }, { upsert: true });

				parseStatusPage(contestid, pageno + 1, callback);
			}, 4, accessToken);
		}
	})
}

require("./helper.js")();

module.exports = function (nextcall) {

	var contestIDS = [];

	MongoClient.connect(mongourl, function (err, db) {
		if (err) {
			throw err;
		}

		collection = db.collection("status");
		usercollection = db.collection("user");
		checklistcollection = db.collection("checklist");

		usercollection.createIndex({ contestid: 1, user: 1 }, { unique: true });

		/*
		bad way
		if (process.argv.length >= 4 && process.argv[3] == 'delete')
		{
			//reset before use
			usercollection.deleteMany({});
			collection.deleteMany({});
		}
		*/

		var processContests = function () {
			async.eachSeries(contestIDS, function (ciid, callback) {
				contestid = ciid;

				collection.findOne({ contestid: contestid }, function (err, obj) {
					var lastpage = (obj !== null ? obj.pagedone : 0);
					parseStatusPage(contestid, lastpage, callback);
				});
			},
				function (err) {
					if (err) {
						console.log("Error", err);
						throw err;
					}

					db.close();
					console.log("Completed ALL");

					setImmediate(nextcall);
				});
		};

		db.collection("checklist").find({}).toArray(function (err, cdatas) {
			if (cdatas) {
				cdatas.forEach(function (x) {
					contestIDS.push(x.contest);
				});
			}

			processContests();
		});
	});

};
