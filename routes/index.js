var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "anrMar#18",
  database: "cs411"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
	res.send('hello man!');
});


router.get('/playerData', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});

router.post('/addCoachRecord', function(req, res, next) {

	var coachData = req.body;
	console.log(coachData);

	con.query("insert into Coach values ('" + coachData.CoachName + "', " + coachData.SeasonsActive
		+ ", " + coachData.CareerWins + ", " + coachData.CareerLosses + ", " + coachData.WInPercentage + ")", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});

router.put('/updateCoachRecord', function(req, res, next) {
	var newCareerWins = req.body.newWins;
	console.log(newCareerWins);

	var coachName = req.body.coachName;
	console.log(coachName);

	con.query("update Coach set CareerWins = " + newCareerWins + " where CoachName = '" + coachName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});

router.delete('/deleteCoachRecord', function(req, res, next) {
	var coachName = req.query.coachName;
	console.log(coachName);

	con.query("delete from Coach where CoachName = '" + coachName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


module.exports = router;
