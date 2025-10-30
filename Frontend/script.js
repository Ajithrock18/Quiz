async function loadQuestions() {
  try {
    const res = await fetch("http://localhost:5000/questions");
    const backendURL = "http://quiz-backend:5000"; // Docker service name
    const questions = await res.json();
    displayQuestions(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

function displayQuestions(questions) {
  const quizContainer = document.getElementById("quiz");
  quizContainer.innerHTML = "";

  questions.forEach((q, i) => {
    const questionHTML = `
      <div class="question-block">
        <h3>${i + 1}. ${q.question}</h3>
        ${q.options
          .map(
            (option) =>
              `<label><input type="radio" name="q${i}" value="${option}"> ${option}</label><br>`
          )
          .join("")}
      </div>
    `;
    quizContainer.innerHTML += questionHTML;
  });

  document.getElementById("submit").addEventListener("click", () => {
    let score = 0;
    questions.forEach((q, i) => {
      const answer = document.querySelector(`input[name="q${i}"]:checked`);
      if (answer && answer.value === q.answer) score++;
    });
    document.getElementById("result").innerText = `🎯 Your score: ${score} / ${questions.length}`;
  });
}

loadQuestions();
