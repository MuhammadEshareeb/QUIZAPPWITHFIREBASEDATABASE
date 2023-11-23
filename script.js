var firebaseConfig = {
  apiKey: "AIzaSyCCjssNJjNdXcQeR2TXYtkXCelY8lfG0Ao",
  authDomain: "quizapp-c2055.firebaseapp.com",
  databaseURL: "https://quizapp-c2055-default-rtdb.firebaseio.com",
  projectId: "quizapp-c2055",
  storageBucket: "quizapp-c2055.appspot.com",
  messagingSenderId: "711937039130",
  appId: "1:711937039130:web:091d1332fe88466b872aa3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database(); // Initialize Realtime Database

console.log(firebase);
console.log(db);

let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount;
let scoreCount = 0;
let count = 11;
let countdown;

// Questions and Options array
const quizArray = [
  {
    id: "0",
    question: "Which is the most widely spoken language in the world?",
    options: ["Spanish", "Mandarin", "English", "German"],
    correct: "Mandarin",
  },
  {
    id: "1",
    question: "Which is the only continent in the world without a desert?",
    options: ["North America", "Asia", "Africa", "Europe"],
    correct: "Europe",
  },
  {
    id: "2",
    question: "Who invented Computer?",
    options: ["Charles Babbage", "Henry Luce", "Henry Babbage", "Charles Luce"],
    correct: "Charles Babbage",
  },
];

// Restart Quiz
restart.addEventListener("click", () => {
  initial();
  displayContainer.classList.remove("hide");
  scoreContainer.classList.add("hide");
});

// Next Button
nextBtn.addEventListener("click", () => {
  // Increment questionCount
  questionCount += 1;
  // If last question
  if (questionCount == quizArray.length) {
    // Hide question container and display score
    displayContainer.classList.add("hide");
    scoreContainer.classList.remove("hide");

    // Show SweetAlert for the user's score
    showScoreAlert(scoreCount, questionCount);
  } else {
    // Display questionCount
    countOfQuestion.innerHTML =
      questionCount + 1 + " of " + quizArray.length + " Question";
    // Display quiz
    quizDisplay(questionCount);
    count = 11;
    clearInterval(countdown);
    timerDisplay();
  }
});

// Timer
const timerDisplay = () => {
  countdown = setInterval(() => {
    count--;
    timeLeft.innerHTML = `${count}s`;
    if (count == 0) {
      clearInterval(countdown);
      nextBtn.click(); // Automatically click the "Next" button when the timer runs out
    }
  }, 1000);
};

// Display quiz
const quizDisplay = (questionCount) => {
  let quizCards = document.querySelectorAll(".container-mid");
  // Hide other cards
  quizCards.forEach((card) => {
    card.classList.add("hide");
  });
  // Display current question card
  quizCards[questionCount].classList.remove("hide");
};

// Quiz Creation
function quizCreator() {
  // Randomly sort questions
  quizArray.sort(() => Math.random() - 0.5);
  // Generate quiz
  for (let i of quizArray) {
    // Randomly sort options
    i.options.sort(() => Math.random() - 0.5);
    // Quiz card creation
    let div = document.createElement("div");
    div.classList.add("container-mid", "hide");
    // Question number
    countOfQuestion.innerHTML = 1 + " of " + quizArray.length + " Question";
    // Question
    let question_DIV = document.createElement("p");
    question_DIV.classList.add("question");
    question_DIV.innerHTML = i.question;
    div.appendChild(question_DIV);
    // Options
    div.innerHTML += `
      <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
       <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
        <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
         <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
      `;
    quizContainer.appendChild(div);
  }
}

// Checker Function to check if the option is correct or not
function checker(userOption) {
  let userSolution = userOption.innerText;
  let question = document.getElementsByClassName("container-mid")[questionCount];
  let options = question.querySelectorAll(".option-div");

  // If user clicked answer == the correct option stored in the object
  if (userSolution === quizArray[questionCount].correct) {
    userOption.classList.add("correct");
    scoreCount++;
  } else {
    userOption.classList.add("incorrect");

    // For marking the correct option
    options.forEach((element) => {
      if (element.innerText == quizArray[questionCount].correct) {
        element.classList.add("correct");
      }
    });
  }

  // Clear interval (stop timer)
  clearInterval(countdown);

  // Disable all options
  options.forEach((element) => {
    element.disabled = true;
  });

  // Store score in Firebase Realtime Database
  db.ref("userScores").push({
    questionId: quizArray[questionCount].id,
    userSolution: userSolution,
    correctSolution: quizArray[questionCount].correct,
    isCorrect: userSolution === quizArray[questionCount].correct,
  });
}

// Initial setup
function initial() {
  quizContainer.innerHTML = "";
  questionCount = 0;
  scoreCount = 0;
  count = 11;
  clearInterval(countdown);
  timerDisplay();
  quizCreator();
  quizDisplay(questionCount);
}

// When the user clicks on the start button
startButton.addEventListener("click", () => {
  startScreen.classList.add("hide");
  displayContainer.classList.remove("hide");
  initial();
});

// Hide quiz and display start screen
window.onload = () => {
  startScreen.classList.remove("hide");
  displayContainer.classList.add("hide");
};

// Function to show SweetAlert for the user's score
function showScoreAlert(score, totalQuestions) {
  Swal.fire({
    icon: "info",
    title: "Quiz Completed",
    html: `Your score is ${score} out of ${totalQuestions} questions.`,
  });
}