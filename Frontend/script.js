// Choose correct backend URL depending on environment
const backendURL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "http://quiz-backend:5000"; // service name used in docker-compose

async function loadQuestions() {
  try {
    const res = await fetch(`${backendURL}/questions`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const questions = await res.json();
    displayQuestions(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    document.getElementById("quiz").innerHTML = `<p style="color:red;">⚠️ Unable to load questions from backend.</p>`;
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
    document.getElementById(
      "result"
    ).innerText = `🎯 Your score: ${score} / ${questions.length}`;
  });
}
