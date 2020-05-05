var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const {spawn} = require('child_process'); 


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nbavision",
  database: "mydb"
});

class player {
	constructor(name, pos, pe, conference) {
	  this.name = name;
	  this.pos = pos;
	  this.pe = pe;
	  this.conference = conference;

	}
  }


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello', function(req, res, next) {
	res.send('hello man!');
});

router.get('/draft', function(req, res, next) {
	var dataToSend;
	// spawn new child process to call the python script
	const python = spawn('python', ['AllStarAI.py']);
	// collect data from script
	python.stdout.on('data', function (data) {
	 console.log('Pipe data from python script ...');
	 dataToSend = data.toString();
	
	});
	// in close event we are sure that stream from child process is closed
	python.on('close', (code) => {
	console.log(`child process close all stdio with code ${code}`);
	// send data to browser
	
	// 10 objects, name, position, player eff, conference

	var tempArr = dataToSend.split(';');


	var dataToSendArr = [];
	let i = 0;

	while(i < 40){
		dataToSendArr.push(	player(tempArr[i],tempArr[i+1],tempArr[i+2],tempArr[i+3]) );
		i = i + 4;
	}


	res.send(dataToSend)
	});
});

router.get('/playerData', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Player Exists");
	})

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/playerPointsPerGame', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Player Exists");
	})

	con.query("select PointsPerGame from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/playerAssistsPerGame', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Player Exists");
	})

	con.query("select AssistsPerGame from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/playerReboundsPerGame', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Player Exists");
	})

	con.query("select ReboundsPerGame from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/playerBlocksPerGame', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Player Exists");
	})

	con.query("select BlocksPerGame from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/playerStealsPerGame', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Player Exists");
	})

	con.query("select StealsPerGame from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/playerGamesPlayed', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Player Exists");
	})

	con.query("select GamesPlayed from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/playerHomeState', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Player Exists");
	})

	con.query("select BirthState from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/playerCollege', function(req, res, next) {
	var playerName = req.query.name;
	console.log(playerName);

	con.query("select * from Player where PlayerName = '" + playerName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Player Exists");
	})

	con.query("select College from Player where PlayerName = '" + playerName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});

router.get('/coachWins', function(req, res, next) {
	var coachName = req.query.name;
	console.log(coachName);

	con.query("select * from Coach where CoachName = '" + coachName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Coach Exists");
	})

	con.query("select CareerWins from Coach where CoachName = '" + coachName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/coachLosses', function(req, res, next) {
	var coachName = req.query.name;
	console.log(coachName);

	con.query("select * from Coach where CoachName = '" + coachName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Coach Exists");
	})

	con.query("select CareerLosses from Coach where CoachName = '" + coachName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/coachSeasons', function(req, res, next) {
	var coachName = req.query.name;
	console.log(coachName);

	con.query("select * from Coach where CoachName = '" + coachName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Coach Exists");
	})

	con.query("select SeasonsActive from Coach where CoachName = '" + coachName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/coachTeamCoached', function(req, res, next) {
	var coachName = req.query.name;
	console.log(coachName);

	con.query("select * from Coach where CoachName = '" + coachName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Coach Exists");
	})

	con.query("select Manages from Coach where CoachName = '" + coachName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/coachPointsPerGame', function(req, res, next) {
	var coachName = req.query.name;
	console.log(coachName);

	con.query("select * from Coach where CoachName = '" + coachName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Coach Exists");
	})

	con.query("select T.PointsScored from Coach C left outer join Team T on C.Manages = T.TeamName where C.CoachName = '" + coachName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


/*router.get('/teamWins', function(req, res, next) {
	var teamName = req.query.name;
	console.log(teamName);

	con.query("select * from Team where TeamName = '" + teamName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Team Exists");
	})

	con.query("select count(*) as wins from Game where Winner = '" + teamName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});*/

router.post('/teamWins', function(req, res, next) {
	/*var teamName = req.query.name;
	console.log(teamName);*/

	var teams = req.body.toCompare;
	console.log(teams);

	/*con.query("select * from Team where TeamName = '" + teamName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Team Exists");
	})*/
	var winsArr = [];
	for (let i = 0; i < teams.length; i++) {

		con.query("select count(*) as wins from Game where Winner = '" + teams[i] + "'", function(err, output) {
			if (err) {
				throw err;
			}

			winsArr.push(output[0].wins);
			console.log(output[0].wins);
			console.log(winsArr);
			if (i == teams.length - 1) {
				res.send(winsArr);
			}
		});
	}
	//console.log(winsArr + "   heeeere ");
	//res.send(winsArr);

	/*con.query("select count(*) as wins from Game where Winner = '" + teamName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})*/
});


router.get('/teamLosses', function(req, res, next) {
	var teamName = req.query.name;
	console.log(teamName);

	con.query("select * from Team where TeamName = '" + teamhName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Team Exists");
	})


	con.query("select 82 - count(*) from Game where Winner = '" + teamName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/teamPoints', function(req, res, next) {
	var teamName = req.query.name;
	console.log(teamName);

	con.query("select * from Team where TeamName = '" + teamName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Team Exists");
	})

	con.query("select PointsScored from Team where TeamName = '" + teamName + "'", function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/teamHomeWins', function(req, res, next) {
	var teamName = req.query.name;
	console.log(teamName);

	con.query("select * from Team where TeamName = '" + teamhName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Team Exists");
	})

	con.query("select count(*) from Game where Winner = '" + teamName + "' and HomeTeam = '" + teamName + "'" , function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/teamAwayWins', function(req, res, next) {
	var teamName = req.query.name;
	console.log(teamName);

	con.query("select * from Team where TeamName = '" + teamhName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Team Exists");
	})

	con.query("select count(*) from Game where Winner = '" + teamName + "' and AwayTeam = '" + teamName + "'" , function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});

// not sure if I did this correctly
router.get('/teamPlayersFromState', function(req, res, next) {
	var teamName = req.query.name;
    console.log(teamName);
    var birthState = req.query.state;
	console.log(birthState);
	
	con.query("select * from Team where TeamName = '" + teamhName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Team Exists");
	})

	con.query("select count(*) from Player where PlaysFor = '" + teamName + "' and BirthState = '" + birthState + "'" , function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});


// not sure if I did this correctly
router.get('/teamPlayersFromCollege', function(req, res, next) {
	var teamName = req.query.name;
    console.log(teamName);
    var college = req.query.college;
    console.log(college);


	con.query("select * from Team where TeamName = '" + teamhName + "'", function(err,output){
		if (err)
			throw err;
		if (output.length == 0)
			res.send("No Team Exists");
	})


	con.query("select count(*) from Player where PlaysFor = '" + teamName + "' and College = '" + college + "'" , function(err, output) {
		if (err)
			throw err;
		res.send(output);
	})
});



router.get('/teams', function(req, res, next) {

	con.query("select * from Team", function(err,output){
		if (err)
			throw err;
		res.send(output);
	})
});

router.get('/players', function(req, res, next) {

	con.query("select * from Player", function(err,output){
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