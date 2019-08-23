var http = require("http");
var https = require("https");
var util = require("util");
var cheerio = require("cheerio");
var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');
var cronJob = require('cron').CronJob;

var isWorking = false;
new cronJob('*/10 * * * *', function () {
	if (isWorking) {
		return;
	}
	isWorking = true;
	var status = require("./status.js");
	var generator = require("./generate.js");
	status(function () {
		generator(function () {
			isWorking = false;
		})
	});
}, null, true);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

//from snipplr
function elapsedTime(createdAt) {
	var ageInSeconds = (new Date().getTime() - new Date(createdAt).getTime()) / 1000;
	var s = function (n) { return n == 1 ? '' : 's' };
	if (ageInSeconds < 0) {
		return 'just now';
	}
	if (ageInSeconds < 60) {
		var n = ageInSeconds;
		return n + ' second' + s(n) + ' ago';
	}
	if (ageInSeconds < 60 * 60) {
		var n = Math.floor(ageInSeconds / 60);
		return n + ' minute' + s(n) + ' ago';
	}
	if (ageInSeconds < 60 * 60 * 24) {
		var n = Math.floor(ageInSeconds / 60 / 60);
		return n + ' hour' + s(n) + ' ago';
	}
	if (ageInSeconds < 60 * 60 * 24 * 7) {
		var n = Math.floor(ageInSeconds / 60 / 60 / 24);
		return n + ' day' + s(n) + ' ago';
	}
	if (ageInSeconds < 60 * 60 * 24 * 31) {
		var n = Math.floor(ageInSeconds / 60 / 60 / 24 / 7);
		return n + ' week' + s(n) + ' ago';
	}
	if (ageInSeconds < 60 * 60 * 24 * 365) {
		var n = Math.floor(ageInSeconds / 60 / 60 / 24 / 31);
		return n + ' month' + s(n) + ' ago';
	}
	var n = Math.floor(ageInSeconds / 60 / 60 / 24 / 365);
	return n + ' year' + s(n) + ' ago';
}

//https://stackoverflow.com/a/40890687/5258585
function filterIt(arr, searchKey) {
	var matches = arr.filter(obj => Object.keys(obj).some(key => obj[key].toString().includes(searchKey)))
	if (matches.length == 0) {
		return ""
	} else {
		return elapsedTime(matches[0].date);
	}
}

require("./helper.js")();

MongoClient.connect(mongourl, function (err, db) {
	if (err) {
		throw err;
	}

	var datacollection = db.collection("data");
	var lastupdatecollection = db.collection("lastupdate");
	var checklist = db.collection("checklist");

	app.get('/', function (req, res) {
		var user = (req.cookies.user ? req.cookies.user : "");

		var result = [];
		datacollection.find({ user: user }).sort({ contest: 1, type: 1 }).toArray().then(predictions => {
			result = predictions;
		}).then(() => {
			return Promise.resolve(lastupdatecollection.find().toArray());
		}).then(lastUpdated => {
			result.forEach(element => {
				element.elapsed = filterIt(lastUpdated, element.contest)
			});
		}).then(() => {
			res.render('landing', { result: result, user: user });
		}).catch(e => {
			console.error(e);
		});
	})

	app.get('/add/:contest', function (req, res) {
		res.render("error", { message: "Sorry, Adding new contest is disabled." })
		/*var cid = req.params.contest;
		checklist.findOneAndReplace(
			{
				contest: cid,
				parse: ['all']
			},
			{
				contest: cid,
				parse: ['all']
			},
			{
				upsert: true
			},
			function (err, result) {
				if (result) {
					res.redirect('/contest/' + cid + '/all');
				} else {
					res.render("error", { message: "Couldnot add to checklist" });
				}
			})*/
	})

	app.get('/contest/:contestid/:type', function (req, res) {
		checklist.findOne({ contest: req.params.contestid }, function (err, obj) {
			if (err) {
				return;
			}
			if (obj) {
				lastupdatecollection.findOne({ contest: req.params.contestid }, function (err, dateobj) {
					if (err)
						throw err;

					if (dateobj) {
						var page = (req.query.page ? req.query.page : 1);
						if (page < 1) {
							page = 1;
						}
						var perPage = (req.query.perPage ? req.query.perPage : 25);
						if (perPage <= 10) {
							perPage = 10;
						}
						else if (perPage <= 25) {
							perPage = 25;
						}
						else if (perPage <= 50) {
							perPage = 50;
						}
						else if (perPage <= 100) {
							perPage = 100;
						}
						else {
							perPage = 1000;
						}
						datacollection.find({ contest: req.params.contestid, type: req.params.type }).limit(perPage).skip((page - 1) * perPage).sort({ rank: 1 }).toArray((err, result) => {
							if (err)
								throw err;

							for (var i in result) {
								result[i].change = result[i].rating - result[i].previous;
							}

							var typename = req.params.type[0].toUpperCase() + req.params.type.slice(1);
							var theme = (req.cookies.theme ? req.cookies.theme : "/css/rating.css");
							datacollection.count({ contest: req.params.contestid, type: req.params.type }).then((count) => {
								res.render('rating', {
									elapsed: elapsedTime(dateobj.date),
									contest: req.params.contestid,
									type: req.params.type,
									typename: typename,
									result: result,
									theme: theme,
									pageCount: parseInt(count / perPage + 1),
									selectedPage: parseInt(page),
									perPage: parseInt(perPage)
								});
							});
						});
					}
					else {
						res.status(404);
						res.render("error", { message: "We are currently calculating ratings for this contest!" });
					}
				});
			}
			else {
				res.status(404);
				var link = req.protocol + "://" + req.get('host') + "/add/" + req.params.contestid
				res.render("error", {
					message: "No contest predictions found for such contest! Please enter correct contest code.",
					link: link
				});
			}
		});
	});

	app.use(function (req, res) {
		res.status(500);
		res.render("error", { message: "Invalid link!" });
	});

	app.listen(process.env.PORT || 8080);

	console.log('Listening on http://127.0.0.1:8080');
});
