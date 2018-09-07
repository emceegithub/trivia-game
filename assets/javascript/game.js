var questionsMasterArray = [
  {
    question: "What US State borders California to the north?",
    choices: ["Oregon", "Washington", "Arizona", "Nevada"],
    feedback: "Oregon borders California to the north."
  },
  {
    question: "What is the city capital of the state of California?",
    choices: ["Sacramento", "Los Angeles", "San Francisco", "San Diego"],
    feedback: "Sacramento is the city capital of the state of California."
  },
  {
    question: "California is home to one out of every how many US Citizens?",
    choices: ["Eight", "Six", "Seven", "Nine"],
    feedback: "California is home to one out of eight US Citizens."
  },
  {
    question: "What was the lowest temperature ever recorded in California?",
    choices: ["-45 F", "-42 F", "-47 F", "-51 F"],
    feedback: "The lowest temperature ever recorded in California is -45 degrees Farenheit."
  },
  {
    question: "In the Sierra Nevada mountains, Mount Whitney reaches what elevation?",
    choices: ["14,505 feet", "16,603 feet", "13,754 feet", "15,621 feet"],
    feedback: "Mount Whitney reaches 14,505 feet in elevation."
  },
  {
    question: "Until 2013, the oldest individual tree in the world was Methuselah, a Great Basin bristlecone pine (Pinus longaeva) in the White Mountains of California. About how old is the tree?",
    choices: ["Approx 4,000 - 5,000 yrs old", "Approx 3,000 - 4,000 yrs old", "Approx 5,000 - 6,000 yrs old", "Approx 2,000 - 3,000 yrs old"],
    feedback: "Scientists estimate that the tree is between 4,000 - 5,000 years old."
  },
  {
    question: "About what percentage of California's land is covered in forests?",
    choices: ["45%", "53%", "38%", "41%"],
    feedback: "About 45% of California is covered in forests."
  }

]

var countDownTimer = {
  timeLeft: 0,
  timerRunning: false,
  timerID: "",
  timePercentage: 100,

  start: function () {
    if (countDownTimer.timerRunning) {
      // If countDownTimer is already running, do nothing.
    } else {
      // If countDownTimer is not running, set condition to running.
      countDownTimer.timerRunning = true;
      // Every 1000ms, call the decrementTimeLeft() function.
      countDownTimer.timerID = setInterval(function () {
        countDownTimer.decrementTimeLeft();
      }, 1000);
    }
  },

  pause: function () {
    clearInterval(countDownTimer.timerID);
    countDownTimer.timerRunning = false;
  },

  reset: function () {
    updateProgressBar(100);
    countDownTimer.timeLeft = originalTimeLeft;
    countDownTimer.displayTimeLeft();
  },

  decrementTimeLeft: function () {
    if (countDownTimer.timeLeft <= 0) {
      // If there is no more time on the clock, stop and reset clock.
      countDownTimer.pause();
      evaluatePosition("noanswer");
    } else {
      // If there is still time on the clock, continue to count down.
      countDownTimer.timeLeft--;
      countDownTimer.displayTimeLeft();
      updateProgressBar((countDownTimer.timeLeft / originalTimeLeft) * 100);
    }
  },

  displayTimeLeft: function () {
    var minutes = Math.floor(countDownTimer.timeLeft / 60);
    var seconds = countDownTimer.timeLeft % 60;
    if (String(minutes).length === 1) {
      minutes = "0" + String(minutes);
    }
    if (String(seconds).length === 1) {
      seconds = "0" + String(seconds);
    }
    document.getElementById("timeleft").innerHTML = minutes + ":" + seconds;
  },

}

const originalTimeLeft = 10; // in seconds
var myQuestions = questionsMasterArray.slice(0);
var currentQuestionNumber = 1;
var correctAnswersCount = 0;
var incorrectAnswersCount = 0;
var unansweredQuestionsCount = 0;
var currentCorrectAnswer = "";

function askQuestion() {
  // Set index based on currentQuestionNumber
  var index = currentQuestionNumber - 1;

  // Save correct answer before shuffling
  currentCorrectAnswer = myQuestions[index].choices[0];

  // Display current question on screen
  $("#question-container").empty();
  $("#question-container").html(myQuestions[index].question);
  $("#choices-container").empty();

  // Clone the array of choices and shuffle it
  var choicesArray = myQuestions[index].choices.slice(0);
  shuffle(choicesArray);

  // Create buttons based on choices
  for (var i = 0; i < choicesArray.length; i++) {
    var divElement = $("<div>");
    var button = $("<button>");
    button.html(choicesArray[i]);
    button.attr("class", "answer-button col-6 mb-2 btn btn-lg btn-dark");
    button.attr("data-value", choicesArray[i]);
    divElement.append(button);
    $("#choices-container").append(divElement);
  }
  // Assign button values
  $(".answer-button").on("click", function () {
    var userSelection = $(this).attr("data-value");
    evaluatePosition(userSelection);
  });

  // Start countDownTimer
  countDownTimer.start();
}

function nextQuestion() {
  currentQuestionNumber++;
  $("#question-container").empty();
  $("#choices-container").empty();
  if (currentQuestionNumber > myQuestions.length) {
    // If there are no more questions left
    countDownTimer.pause();
    // alert("No more questions left");
    renderFinalScores();
    renderButton("New Game", "start-new-game-button", newGame);
  } else {
    countDownTimer.reset();
    askQuestion();
  }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
}

function evaluatePosition(userSelection) {
  countDownTimer.pause();
  countDownTimer.reset();
  var index = currentQuestionNumber - 1;
  if (userSelection === "noanswer") {
    swal({
      title: "Time is up!",
      text: myQuestions[index].feedback,
      type: "warning",
      showCancelButton: false,
      confirmButtonClass: "btn-warning",
      confirmButtonText: "OK",
      closeOnConfirm: true
    },
      function () {
        nextQuestion();
      });

  } else if (userSelection === currentCorrectAnswer) {
    correctAnswersCount++;
    unansweredQuestionsCount--;
    swal({
      title: "Correct!",
      text: myQuestions[index].feedback,
      type: "success",
      showCancelButton: false,
      confirmButtonClass: "btn-success",
      confirmButtonText: "OK",
      closeOnConfirm: true
    },
      function () {
        nextQuestion();
      });

  } else {
    incorrectAnswersCount++;
    unansweredQuestionsCount--;
    swal({
      title: "Incorrect!",
      text: myQuestions[index].feedback,
      type: "error",
      showCancelButton: false,
      confirmButtonClass: "btn-danger",
      confirmButtonText: "OK",
      closeOnConfirm: true
    },
      function () {
        nextQuestion();
      });

  }

}

function updateProgressBar(percentage) {
  document.getElementById("progress-bar").setAttribute("style", `width:${percentage}%`);
}

function initializeGame() {
  // Set current question to #1
  currentQuestionNumber = 1;

  // Clear out the question and answers HTML
  $("#question-container").empty();
  $("#choices-container").empty();
  $("#final-score").empty();

  // Shuffle questions array
  shuffle(myQuestions);

  // Set countDownTimer to original clock
  countDownTimer.timeLeft = originalTimeLeft;
  countDownTimer.displayTimeLeft();

  // Set correctAnswersCount to zero
  correctAnswersCount = 0;

  // Set incorrectAnswersCount to zero
  incorrectAnswersCount = 0;

  // Set unansweredQuestionsCount to the number of questions in array;
  unansweredQuestionsCount = myQuestions.length;

  // Create "Start Game" Button for user
  renderButton("Start Game", "start-new-game-button", askQuestion);
}

function renderButton(buttonText, id, func) {
  var divElement = $("<div>");
  var buttonElement = $("<button>");
  buttonElement.html(buttonText);
  buttonElement.attr("class", "answer-button col-6 mb-2 btn btn-lg btn-dark");
  buttonElement.attr("id", id);
  divElement.append(buttonElement);
  $("#choices-container").append(divElement);
  $(`#${id}`).on("click", func);
}

function newGame() {
  // Reset the timer
  countDownTimer.pause();
  countDownTimer.reset();
  initializeGame();
}

function showFeedback(evaluation, feedback) {
  $("#question-container").empty();
  $("#choices-container").empty();
  var h2Element = $("<h2>");
  var divElement = $("<div>");
  h2Element.html(evaluation);
  divElement.html(feedback);
  $("#question-container").append("<br>");
  $("#question-container").append(h2Element);
  $("#question-container").append("<br>");
  $("#question-container").append(divElement);
}

function renderFinalScores() {
  $("#question-container").empty();
  $("#choices-container").empty();
  var divElement1 = $("<div>");
  var divElement2 = $("<div>");
  var divElement3 = $("<div>");
  divElement2.html("Correct");
  divElement2.attr("class", "text-center");
  divElement3.html(correctAnswersCount);
  divElement3.attr("class", "text-center display-2");
  divElement1.append(divElement2);
  divElement1.append(divElement3);
  $("#final-score").append(divElement1);

  var divElement1 = $("<div>");
  var divElement2 = $("<div>");
  var divElement3 = $("<div>");
  divElement2.html("Incorrect");
  divElement2.attr("class", "text-center");
  divElement3.html(incorrectAnswersCount);
  divElement3.attr("class", "text-center display-2");
  divElement1.append(divElement2);
  divElement1.append(divElement3);
  $("#final-score").append(divElement1);

  var divElement1 = $("<div>");
  var divElement2 = $("<div>");
  var divElement3 = $("<div>");
  divElement2.html("Unanswered");
  divElement2.attr("class", "text-center");
  divElement3.html(unansweredQuestionsCount);
  divElement3.attr("class", "text-center display-2");
  divElement1.append(divElement2);
  divElement1.append(divElement3);
  $("#final-score").append(divElement1);
}

initializeGame();
