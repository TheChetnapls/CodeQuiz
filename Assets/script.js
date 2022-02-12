var main = document.querySelector(".container");
var title = document.querySelector("#big-words");
var paraG = document.querySelector("#small-words");
var choices = document.querySelector("#choices");
var timer = document.querySelector("#timer");
var message = document.querySelector('#right-wrong');
var quizIndex = 0;
var score;
var intials;
let startTime = 30;


//intialize object for questions, answer choices, and correct answer
var quiz = [{
    question: "what the frick",
    choices: ["frick", "duh", "hello world", "whoops"],
    answer: "duh"
}, {
    question: "i hate ____",
    choices: ["donald drumpf", "bilary bilton", "cancer", "uuuhhhhh"],
    answer: "cancer"
}, {
    question: "whats two plus two, dawg",
    choices: ["two", "2", "too", "2x2"],
    answer: "2x2"
}];

//starting code to start quiz
function init() {
    score = 0;
    title.textContent = "Coding Quiz Challenge"
    var startButton = document.createElement("button");
    startButton.textContent = "Start Quiz";
    startButton.setAttribute("id", "start")
    main.appendChild(startButton);
    startButton.addEventListener("click", function (event) {
        event.preventDefault();
        //remove start button
        document.querySelector("#start").remove();
        renderQuestion();
    });
};

function timerRender(theTime) {
    timer.textContent = theTime;
    theTime--;
}

//code to render questions and options and start timer
function renderQuestion() {
    //clears previous list of choices
    while (choices.firstChild) {
        choices.removeChild(choices.firstChild);
    }
    //check if any questions are left in quiz
    if (quizIndex == quiz.length) {
        endGame();
    } else {
        //ask question
        title.textContent = quiz[quizIndex].question;
        //render the options for the question
        for (var i = 0; i < quiz[quizIndex].choices.length; i++) {
            //create buttons as list items
            let li = document.createElement("li")
            //did not work when using var option
            //each button's event lister would act is if last button was
            //clicked, due to hoisting, var gets hoisted before code finsihes
            let option = document.createElement("button");
            option.setAttribute("id", "op-" + i)
            //add options to buttons
            option.textContent = quiz[quizIndex].choices[i];

            //append buttons to li and the li to the main ul
            li.appendChild(option);
            choices.appendChild(li);
            //add event listener to buttons
            option.addEventListener("click", function (event) {
                //check answer
                checkAnswer(option.textContent);
            });
            //
            //var butID = "op-" + JSON.stringify(i);
            // document.querySelector("[id=" + CSS.escape(butID) + "]").addEventListener("click", function () {
            //     console.log(option.textContent)
            //     //checkAnswer(choiceList[i].textContent);
            // });
        };
    };
};

//determine if choice is right or wrong
function checkAnswer(userChoice) {
    if (userChoice == quiz[quizIndex].answer) {
        message.textContent = "you got it right champ!";
        score++;
    } else {
        message.textContent = "ya messed up kid"
    };
    //move to next question, increase quiz index, and render next question
    quizIndex++;
    renderQuestion();
};

//give score and option to input initials to submit score
//ask to either view high scores or play again
function endGame() {
    title.textContent = "All Done";
    message.textContent = "";
    //show score
    paraG.textContent = "Your score is " + score;
    //ask for initals and save to local storage with score
    let intialInput = document.createElement("textarea");
    intialInput.setAttribute("id", "initials");
    main.appendChild(intialInput);
    //submit intials with score
    let submitScore = document.createElement("button");
    submitScore.innerText = "Submit Score";
    submitScore.setAttribute("id", "submit")
    main.appendChild(submitScore);
    submitScore.addEventListener("click", function () {
        let newScore = {
            initials: document.getElementById('initials').value,
            theirScore: score
        };
        storeScore(newScore);
    });
};

function storeScore(newData) {
    let highScores = JSON.parse(localStorage.getItem("storedScores"));
    let scoreArray;
    let scoreString;
    let push = true;
    if (highScores == null) {
        scoreArray = [newData];
        scoreString = JSON.stringify(scoreArray);
        localStorage.setItem("storedScores", scoreString);
    }
    else {
        scoreArray = highScores;
        for (let k = 0; k < scoreArray.length; k++) {
            if (scoreArray[k].theirScore <= newData.theirScore) {
                scoreArray.splice(k, 0, newData);
                push = false;
                break;
            };
        };
        if (push) {
            scoreArray.push(newData);
        };
    };
    scoreString = JSON.stringify(scoreArray);
    localStorage.setItem("storedScores", scoreString);

    highScore();
}

function highScore() {
    title.textContent = "HighScores";
    paraG.textContent = "";
    document.getElementById('initials').remove();
    document.getElementById('submit').remove();

    scoreList = document.createElement('ul');
    scoreList.setAttribute("id", "scoreList")
    main.appendChild(scoreList);

    let scores = JSON.parse(localStorage.getItem("storedScores"));

    for (let j = 0; j < scores.length; j++) {
        let aScore = document.createElement("li");
        aScore.textContent = scores[j].initials + ": " + scores[j].theirScore;
        scoreList.appendChild(aScore);
    }

    var playAgain = document.createElement("button");
    playAgain.textContent = "Play Again";
    playAgain.setAttribute("id", "start")
    main.appendChild(playAgain);
    playAgain.addEventListener("click", function (event) {
        event.preventDefault();
        //remove start button
        document.querySelector("#start").remove();
        quizIndex = 0;
        score = 0;
        scoreList.remove();
        renderQuestion();
    });
};

init();
setInterval(timerRender(startTime), 1000);

