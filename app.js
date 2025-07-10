let score = 0;
let currentQuestion = 0;
let data = [];
let timer;
let timeLeft = 10;

function startQuiz() {
  const startBtn = document.getElementById('startQuizBtn');
  if (startBtn) startBtn.style.display = 'none';

  fetch('https://opentdb.com/api.php?amount=10')
    .then(response => response.json())
    .then(json => {
      data = json.results;
      if (data.length > 0) {
        showQuestion(currentQuestion);
      } else {
        alert("No questions fetched from the server.");
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

function shuffleArray(arr) {
  const unique = [...new Set(arr)];
  return unique.sort(() => Math.random() - 0.5);
}

function showQuestion(index) {
  clearInterval(timer);
  timeLeft = 10;

  const timerEl = document.getElementById('timer');
  if (timerEl) timerEl.innerText = `Time: ${timeLeft}s`;

  const q = data[index];
  const allAnswers = shuffleArray([...q.incorrect_answers, q.correct_answer]);

  let output = `
    <div class="quiz-card">
      <h2 class="quiz-question">${index + 1}. ${q.question}</h2>
     <ul class="quiz-options" style="list-style: none; padding-left: 0;">
        ${allAnswers.map(answer => `
          <li><label class="quiz-option"><input type="radio" name="q${index}" value="${answer}"> ${answer}</label></li>`).join('')}
      </ul>
      
     <button id="submitBtn" class="btn btn-success quiz-submit">Submit Answer</button>

      <p id="result" class="quiz-result"></p>
    </div>
  `;

  document.getElementById('getBox').innerHTML = output;

  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.onclick = function () {
      checkAnswer(index, q.correct_answer);
    };
  }

  timer = setInterval(() => {
    timeLeft--;
    if (timerEl) timerEl.innerText = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      const submitBtn = document.getElementById('submitBtn');
      if (submitBtn) submitBtn.disabled = true;
      const resultEl = document.getElementById('result');
      if (resultEl) {
        resultEl.innerText = 'Time up!';
        resultEl.style.color = 'red';
      }
      setTimeout(nextQuestion, 1500);
    }
  }, 1000);
}

function checkAnswer(index, correct) {
  clearInterval(timer);
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) submitBtn.disabled = true;

  const radios = document.getElementsByName('q' + index);
  let selected = '';

  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      selected = radios[i].value;
      break;
    }
  }

  const result = document.getElementById('result');

  if (selected === '') {
    if (result) {
      result.innerText = 'Please select an answer.';
      result.style.color = 'orange';
    }
  } else if (selected === correct) {
    if (result) {
      result.innerText = 'Correct!';
      result.style.color = 'green';
    }
    score++;
  } else {
    if (result) {
      result.innerText = 'Incorrect!';
      result.style.color = 'red';
    }
  }

  const scoreBoardEl = document.getElementById('scoreBoard');
  if (scoreBoardEl) scoreBoardEl.innerText = `Score: ${score}`;

  setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < data.length) {
    showQuestion(currentQuestion);
  } else {
    showResult();
  }
}

function showResult() {
  let percentage = (score / data.length) * 100;
  let status = percentage >= 70 ? 'Pass' : 'Fail';
const modalBody = document.querySelector('#resultModal .modal-body');


  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
resultModal.show();

  document.getElementById('getBox').innerHTML = `
    <div class="quiz-card result-modal">
      <h2>Quiz Completed</h2>`
      modalBody.innerHTML = `
  <p><strong>Total Correct:</strong> ${score}/10</p>
  <p><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
  <p><strong>Status:</strong> <span class="fw-bold text-${status === 'Pass' ? 'success' : 'danger'}">${status}</span></p>
    </div>
  `;

  document.getElementById('retryBtn').onclick = () => {
    location.reload();
  };
}

window.onload = () => {
  if (!document.getElementById('timer')) {
    const timerDiv = document.createElement('div');
    timerDiv.id = 'timer';
    timerDiv.className = 'quiz-timer';
    document.body.insertBefore(timerDiv, document.body.firstChild);
  }

  if (!document.getElementById('scoreBoard')) {
    const scoreDiv = document.createElement('div');
    scoreDiv.id = 'scoreBoard';
    scoreDiv.className = 'quiz-score';
    document.body.insertBefore(scoreDiv, document.body.firstChild);
  }

  const startHtml = `
    <div class="quiz-card">
      <h2>Quiz Instructions</h2>
      <ul class="quiz-info">
        <li>Total Questions: 10</li>
        <li>Time Per Question: 10 seconds</li>
        <li>Passing Criteria: 70%</li>
      </ul>
      <button id="startQuizBtn" class="btn btn-primary quiz-start">Start Quiz</button>

    </div>
  `;
  document.getElementById('getBox').innerHTML = startHtml;

  // ✅ This line fixes the issue
  document.getElementById('startQuizBtn').addEventListener('click', startQuiz);

  const scoreBoard = document.getElementById('scoreBoard');
  if (scoreBoard) scoreBoard.innerText = "Score: 0";

  const timerDisplay = document.getElementById('timer');
  if (timerDisplay) timerDisplay.innerText = "Time: 10s";
};
