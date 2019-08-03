let game = {
	timeLimit: 30,
	timeLeft: 30,
	gameWin: false,
	questionTimes: [],
	currentQuestion: 0,
	avgTime: 0,
	questionsShown: 0,
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
function intraQuestion(id, correct) {
	//fades out the timer and once it has finished, continues
	$("#timer").text(game.timeLimit);
	if (id === correct) {
		console.log("correct");
	} else {
		console.log("correct");
	}
	setTimeout(function() {
		$("#next-question").fadeIn();
	}, 2 * 1000)
	//TODO: Generate correct or incorrect content and append
	$("#question-result").fadeIn();
	// TODO : If (quesionsShown = all then show end screen after (#next-button text to FINISH))
}

//handles generating the next question screen
function nextQuestion() {
	//clears out old answers
	$("#answers").empty();
	//grabs the current set of answers
	let answers = game.questions[game.currentQuestion].answers;
	//then generates a button for each answer and appends it
	for (let i in answers) {
		$("#answers").append(
			$("<button>")
				.text(answers[i])
				.attr("value", answers[i])
				.addClass("answer")
		);
	}
	//grabs current question
	$("#question").text(game.questions[game.currentQuestion].question);
	//displays all Q&A and starts the timer
	$("#question").fadeIn();
	$("#answers").fadeIn();
	$("#timer").fadeIn();
	timerStart();
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

function timeStop() {
	clearInterval(intervalId);
	game.clockRunning = false;
	if (game.timeLeft <= 0) {
		console.log("time's up!");
	}
	game.timeLeft = game.timeLimit;
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

arrayAvg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

//initializing a variable to hold the timer interval
let intervalId;

//click handlers for the 3 button types
$("#start").click(function() {
	$("#game-result").fadeOut();
	shuffleArray(game.questions);
	$.when($("#start").fadeOut()).done(nextQuestion);
});

$(document).on("click", ".answer", function() {
	//stop the timer, and record the time it took to answer
	timeStop();
	game.questionTimes.push(game.timeLeft);
	//store the value of the button clicked, and pull the correct answer
	let answer = this.value;
	let correct = game.questions[game.currentQuestion].correct;
	//increment current question so the next will be pulled
	game.currentQuestion++;
	$("#question").fadeOut();
	$("#timer").fadeOut();
	//pass the selected answer and the correct answer into the intraquestion function
	$.when($("#answers").fadeOut()).done(function() {
		intraQuestion(answer, correct);
	});
});

$("#next-question").click(function() {
	$.when($("#next-question").fadeOut()).done(nextQuestion);
});
