
let score = 0;

  fetch('https://opentdb.com/api.php?amount=10')
    .then(response => response.json())
    .then(data => {
      let output = '';

      data.results.forEach((sawal, index) => {

        
        const allAnswers = [
          sawal.incorrect_answers[0],
          sawal.incorrect_answers[1],
          sawal.incorrect_answers[2],
          sawal.correct_answer
        ];

        output += `
          <div class="container" style="margin-top: 30px;">
            <h2 class="quiz_text">${index + 1}. ${sawal.question}</h2>
          <ul>
                <li>
                <label>
                <input type="radio" name="q${index}" value="${allAnswers[0]}">
                 ${allAnswers[0]}
                 </label>
                 </li>
                <li>
                <label>
                <input type="radio" name="q${index}" value="${allAnswers[1]}"> ${allAnswers[1]}
                </label>
                </li>
                <li><label><input type="radio" name="q${index}" value="${allAnswers[2]}"> ${allAnswers[2]}</label></li>
                <li><label><input type="radio" name="q${index}" value="${allAnswers[3]}"> ${allAnswers[3]}</label></li>
              </ul>
            <button class="btn btn-success" onclick="checkAnswer(${index}, this); this.disabled = true;"  data-answer="${sawal.correct_answer}">
              <span class="correct_answer">Check Answer</span>
            </button>
             <p id="result_${index}" style="font-weight: bold;"></p>
          </div>
        `;
      });

      document.getElementById('getBox').innerHTML = output;
     

    })
    .catch(error => console.error('Error fetching data:', error));

 function checkAnswer(index, button) {
  const radios = document.getElementsByName('q' + index);
  const correct = button.getAttribute('data-answer');
  let selected = '';

  for (let i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      selected = radios[i].value;
      break;
    }
  }

  const result = document.getElementById('result_' + index);

  if (selected === '') {
    result.innerText = 'Please select an answer.';
    result.style.color = 'orange';
  } else if (selected === correct) {
    result.innerText = 'Correct!';
    result.style.color = 'green';
    score++; 
  } else {
    result.innerText = 'Incorrect!';
    result.style.color = 'red';
  }

  document.getElementById('scoreBoard').innerText = `Score: ${score}`;
}
