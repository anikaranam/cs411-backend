var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const {spawn} = require('child_process'); 


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "anrMar#18",
  database: "cs411"
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
		dataToSendArr.push(	new player(tempArr[i],tempArr[i+1],tempArr[i+2],tempArr[i+3]) );
		i = i + 4;
	}


	res.send(dataToSendArr)
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


router.post('/playerPointsPerGame', function(req, res, next) {
	
	var players = req.body.toCompare;	
	console.log(players);

	var ppgArr = [];

	for (let i = 0; i < players.length; i++) {
		con.query("select PointsPerGame as ppg from Player where PlayerName = '" + players[i] + "'", function(err, output) {
			if (err)
				throw err;
			ppgArr.push(output[0].ppg);
			console.log(output[0].ppg);
			console.log(ppgArr);
			if (i == players.length - 1) {
				res.send(ppgArr);
			}
		})
	}
	
});


router.post('/playerAssistsPerGame', function(req, res, next) {
	var players = req.body.toCompare;	
	console.log(players);

	var apgArr = [];

	for (let i = 0; i < players.length; i++) {
		con.query("select AssistsPerGame as apg from Player where PlayerName = '" + players[i] + "'", function(err, output) {
			if (err)
				throw err;
			apgArr.push(output[0].apg);
			console.log(output[0].apg);
			console.log(apgArr);
			if (i == players.length - 1) {
				res.send(apgArr);
			}
		})
	}
});


router.post('/playerReboundsPerGame', function(req, res, next) {
	var players = req.body.toCompare;	
	console.log(players);

	var rpgArr = [];

	for (let i = 0; i < players.length; i++) {
		con.query("select ReboundsPerGame as rpg from Player where PlayerName = '" + players[i] + "'", function(err, output) {
			if (err)
				throw err;
			rpgArr.push(output[0].rpg);
			console.log(output[0].rpg);
			console.log(rpgArr);
			if (i == players.length - 1) {
				res.send(rpgArr);
			}
		})
	}
});


router.post('/playerBlocksPerGame', function(req, res, next) {
	var players = req.body.toCompare;	
	console.log(players);

	var bpgArr = [];

	for (let i = 0; i < players.length; i++) {
		con.query("select BlocksPerGame as bpg from Player where PlayerName = '" + players[i] + "'", function(err, output) {
			if (err)
				throw err;
			bpgArr.push(output[0].bpg);
			console.log(output[0].bpg);
			console.log(bpgArr);
			if (i == players.length - 1) {
				res.send(bpgArr);
			}
		})
	}
});


router.post('/playerStealsPerGame', function(req, res, next) {
	var players = req.body.toCompare;	
	console.log(players);

	var spgArr = [];

	for (let i = 0; i < players.length; i++) {
		con.query("select StealsPerGame as spg from Player where PlayerName = '" + players[i] + "'", function(err, output) {
			if (err)
				throw err;
			spgArr.push(output[0].spg);
			console.log(output[0].spg);
			console.log(spgArr);
			if (i == players.length - 1) {
				res.send(spgArr);
			}
		})
	}
});


router.post('/playerGamesPlayed', function(req, res, next) {
	var players = req.body.toCompare;	
	console.log(players);

	var gpArr = [];

	for (let i = 0; i < players.length; i++) {
		con.query("select GamesPlayed as gp from Player where PlayerName = '" + players[i] + "'", function(err, output) {
			if (err)
				throw err;
			gpArr.push(output[0].gp);
			console.log(output[0].gp);
			console.log(gpArr);
			if (i == players.length - 1) {
				res.send(gpArr);
			}
		})
	}
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

	var teams = req.body.toCompare;
	console.log(teams);

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

});


router.post('/teamLosses', function(req, res, next) {

	var teams = req.body.toCompare;
	console.log(teams);
	

	var lossesArr = [];
	for (let i = 0; i < teams.length; i++) {
		con.query("select 82 - count(*) as losses from Game where Winner = '" + teams[i] + "'", function(err, output) {
			if (err)
				throw err;
			lossesArr.push(output[0].losses);
			console.log(output[0].losses);
			console.log(lossesArr);
			if (i == teams.length - 1) {
				res.send(lossesArr);
			}
		})
	}

	
});


router.post('/teamPoints', function(req, res, next) {
	var teams = req.body.toCompare;
	console.log(teams);

	var pointsArr = [];
	for (let i = 0; i < teams.length; i++) {
		con.query("select PointsScored as points from Team where TeamName = '" + teams[i] + "'", function(err, output) {
			if (err)
				throw err;
			pointsArr.push(output[0].points);
			console.log(output[0].points);
			console.log(pointsArr);
			if (i == teams.length - 1) {
				res.send(pointsArr);
			}
		})
	}
});


router.post('/teamHomeWins', function(req, res, next) {

	var teams = req.body.toCompare;
	console.log(teams);

	var homeWinsArr = [];

	for (let i = 0; i < teams.length; i++) {
		con.query("select count(*) as homeWins from Game where Winner = '" + teams[i] + "' and HomeTeam = '" + teams[i] + "'" , function(err, output) {
			if (err)
				throw err;
				homeWinsArr.push(output[0].homeWins);
				console.log(output[0].homeWins);
				console.log(homeWinsArr);
				if (i == teams.length - 1) {
					res.send(homeWinsArr);
				}
		})
	}
});


router.post('/teamAwayWins', function(req, res, next) {
	var teams = req.body.toCompare;
	console.log(teams);

	var awayWinsArr = [];

	for (let i = 0; i < teams.length; i++) {
		con.query("select count(*) as awayWins from Game where Winner = '" + teams[i] + "' and AwayTeam = '" + teams[i] + "'" , function(err, output) {
			if (err)
				throw err;
				awayWinsArr.push(output[0].awayWins);
				console.log(output[0].awayWins);
				console.log(awayWinsArr);
				if (i == teams.length - 1) {
					res.send(awayWinsArr);
				}
		})
	}
});

// not sure if I did this correctly
/*router.get('/teamPlayersFromState', function(req, res, next) {
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
*/


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

router.get('/readCoachRecord', function(req, res, next) {
	var coachName = req.query.coachName;
	con.query("select * from Coach where CoachName = '" + coachName + "'", function(err,output){
		if (err)
			throw err;
		res.send(output);
	})
});

router.post('/addCoachRecord', function(req, res, next) {

	var coachData = req.body;
	console.log(coachData);

	var winPercent = (parseInt(coachData.CareerWins)/ (parseInt(coachData.CareerWins) + parseInt(coachData.CareerLosses))) * 100;

	con.query("insert into Coach values ('" + coachData.CoachName + "', " + coachData.SeasonsActive
		+ ", " + coachData.CareerWins + ", " + coachData.CareerLosses + ", " + winPercent+ ", '" + "New Orleans Pelicans'" + 
		")", function(err, output) {
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

router.get('/playerWins', function(req, res, next) {
	con.query("select Player.PlayerName, wins_table.number_of_wins from Player, (Select Game.Winner, Count(Winner) as number_of_wins from Game Group By Winner) wins_table where Player.PlaysFor = wins_table.Winner", function(err,output){
		if (err)
			throw err;
		res.send(output);
	})
});


router.get('/topPoints', function(req, res, next) {
	con.query("select x.number/y.number as topPoints from (select Count(Player.PlayerName) as number from Player join (Select Game.Winner from Game Group By Winner ORDER BY Count(Winner) DESC LIMIT 10) top_ten ON top_ten.Winner = Player.playsFor WHERE Player.PointsPerGame > 20) x JOIN (SELECT Count(Player.PlayerName) as number FROM Player WHERE Player.PointsPerGame >20) y", function(err,output){
		if (err)
			throw err;
		res.send(output);
	})
});

router.post('/compareCoaches', function(req, res, next) {
	var coach1 = req.query.name1;
	var coach2 = req.query.name2;
	console.log(coach1 + "   " + coach2);
	con.query("select CoachName, PointsScored from Coach c, Team t where c.Manages = t.TeamName and (CoachName = '" + coach1 + "' or CoachName = '" + coach2 + "') ", function(err,output){
		if (err)
			throw err;

		var winner = {
			name: "",
			points: ""
		}
		console.log(output[0]);
		if (output[0].PointsScored > output[1].PointsScored) {
			winner.name = output[0].CoachName;
			winner.points = output[0].PointsScored;
		} else {
			winner.name = output[1].CoachName;
			winner.points = output[1].PointsScored;
		}
		console.log(winner);
		res.send(winner);
	})
});

module.exports = router;