let game = {
	timeLimit: 30,
	timeLeft: 30,
	questionTimes: [],
	currentQuestion: 0,
	avgTime: 0,
	questionsRight: 0,
	correctPercentage: "",
	clockRunning: false,

	questions: [
		{
			question: "What is the name of the avatar before Aang?",
			answers: ["Kyoshi", "Roku", "Korra", "Kuruk"],
			correct: "Roku"
		},
		{
			question:
				"What is the name of the spirit that watches over his desert library?",
			answers: ["Wan Shi Tong", "Mao Zedong", "Sozin", "Jinora"],
			correct: "Wan Shi Tong"
		},
		{
			question:
				"What is the name of the Earth King during the time of the show?",
			answers: ["Long Feng", "Bosco", "Jonshin", "Kuei"],
			correct: "Kuei"
		},
		{
			question:
				"What is the name of the Lake that housed the Earth Kingdom's secret prison?",
			answers: ["Lake Marianne", "Lake Lamon", "Lake Laogai", "Lake Soodun"],
			correct: "Lake Laogai"
		},
		{
			question: "What is Iroh's nickname?",
			answers: [
				"The Dragon of the West",
				"The Savior of Ba Sing Se",
				"The Jade Serpent",
				"La Flame"
			],
			correct: "The Dragon of the West"
		},
		{
			question: "What was Iroh's son's name?",
			answers: ["Lu Ten", "Cain", "Quaigon", "Xiping"],
			correct: "Lu Ten"
		},
		{
			question: "What animal taught Toph to earthbend?",
			answers: ["Badgermoles", "Horselizards", "None", "Sky Bison"],
			correct: "Badgermoles"
		},
		{
			question: "To what was Yue reincarnated?",
			answers: [
				"The Moon Spirit",
				"The Sun Goddess",
				"The Painted Lady",
				"A Guru"
			],
			correct: "The Moon Spirit"
		},
		{
			question: "What is the name of the secret police force of Ba Sing Se?",
			answers: [
				"The Dai Li",
				"The Ty Lee",
				"The White Lotus",
				"The Society of the Crossed Keys"
			],
			correct: "The Dai Li"
		},
		{
			question: "What was the nickname of Fire Lord Ozai?",
			answers: ["The Phoenix King", "The Comet", "Bringer of Flame", "Caldera"],
			correct: "The Phoenix King"
		}
	]
};

//shows whether the question was correct or not, and give a next question button
function interQuestion(answer) {
	var correct = game.questions[game.currentQuestion].correct;
	game.currentQuestion++;
	$("#question").fadeOut();
	$("#timer-container").fadeOut();

	$.when($("#answers").fadeOut()).done(function() {		
		//fades out the timer and once it has finished, continues
		$("#timer").text(game.timeLimit);
		//create a new empty div to hold content, and clear out the old result
		let resultContent = $("<div>");
		$("#question-result").empty();

		if (answer === correct) {
			var resultText = $("<h2>").text("Correct!");
			game.questionsRight++;
		} else {
			var resultText = $("<h2>").text("Incorrect.");
		}
		resultContent.append(resultText);
		var explanation = $("<h3>").text("The correct answer was: " + correct);
		resultContent.append(explanation);
		$("#question-result").append(resultContent);
		$("#question-result").fadeIn();

		setTimeout(function() {
			$.when($("#question-result").fadeOut()).done(function() {
				$("#question-result").empty();
				nextQuestion();
			});
		}, 5 * 1000);
		$("#question-result").fadeIn();
	});
}

//handles generating the next question screen
function nextQuestion() {
	//first check if all questions have been answered
	if (game.currentQuestion === game.questions.length) {
		gameEnd();
	} else {
		//clears out old answers
		$("#answers").empty();
		//grabs the current set of answers
		let answers = game.questions[game.currentQuestion].answers;
		shuffleArray(answers);
		//then generates a button for each answer and appends it
		for (let i in answers) {
			$("#answers").append(
				$("<button>")
					.text(answers[i])
					.attr("data-answer", answers[i])
					.addClass("answer")
			);
		}
		//grabs current question
		$("#question").text(game.questions[game.currentQuestion].question);
		//displays all Q&A and starts the timer
		$("#question").fadeIn();
		$("#answers").fadeIn();
		$("#timer-container").fadeIn();
		timerStart();
	}
}

function gameEnd() {
	//grabbing empty div from DOM
	let resultDiv = $("#game-result");
	//averaging time to answer and calculating % correct
	game.avgTime = arrayAvg(game.questionTimes);
	game.correctPercentage = game.questionsRight / game.questions.length;

	//creating our new DOM elements
	let newGame = $("<button>")
		.attr("id", "new-game")
		.text("TRY AGAIN");
	let gameStats = $("<div>");

	//appending in game stats then adding it all to the page
	gameStats.append("<h2> Questions Right: " + game.questionsRight + "</h2>");
	gameStats.append("<h2> Average Time to Answer: " + game.avgTime + " s </h2>");
	gameStats.append(
		"<h2> Percent Correct: " + game.correctPercentage * 100 + "% </h2>"
	);

	resultDiv.append("<h1>Game over!</h1>");
	resultDiv.append(gameStats);
	resultDiv.append(newGame);

	resultDiv.fadeIn();
}

//checks if clock is already running and if not starts it
function timerStart() {
	if (!game.clockRunning) {
		intervalId = setInterval(count, 1000);
		game.clockRunning = true;
	}
}

//function that decrements timer and updates the screen until the timer = 0
function count() {
	if (game.timeLeft > 0) {
		game.timeLeft--;
		$("#timer").text(game.timeLeft);
	} else {
		timeStop();
	}
}

//stops time and handles question change if you ran out of time
function timeStop() {
	clearInterval(intervalId);
	if (game.clockRunning) {
		game.questionTimes.push(game.timeLeft);
		interQuestion();
	}
	game.clockRunning = false;
	game.timeLeft = game.timeLimit;
}

//huffles an array in place randomly.
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

//averages all numbers in an array
arrayAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

//initializing a variable to hold the timer interval
let intervalId;

//click handlers for the 3 button types
$("#start").click(function() {
	shuffleArray(game.questions);
	$("#game-header").fadeOut();
	$.when($("#start").fadeOut()).done(nextQuestion);
});

$(document).on("click", ".answer", function() {
	//stop the timer, and record the time it took to answer
	game.questionTimes.push(game.timeLeft);
	game.clockRunning = false;
	timeStop();
	//store the value of the button clicked, and pull the correct answer
	let answer = $(this).data("answer");
	interQuestion(answer);
});

//when new game is clicked, reinitializes game state
$(document).on("click", "#new-game", function() {
	$.when($("#game-result").fadeOut()).done(function() {
		$("#game-result").empty();
		game.questionTimes = [];
		game.currentQuestion = 0;
		game.avgTime = 0;
		game.questionsRight = 0;
		game.correctPercentage = "";
		game.clockRunning = false;

		$("#game-header").fadeIn();
		$("#start").fadeIn();
	});
});
