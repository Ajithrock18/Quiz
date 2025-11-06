// Choose correct backend URL depending on environment
const backendURL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "http://quiz-backend:5000"; // service name used in docker-compose

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
  return res.json();
}

async function loadQuestions() {
  try {
    // primary: backend endpoint
    const questions = await fetchJson(`${backendURL}/questions`);
    displayQuestions(questions);
  } catch (errBackend) {
    console.warn("Backend fetch failed, trying local questions.json:", errBackend);
    try {
      // fallback: local file (Frontend/questions.json)
      const questions = await fetchJson("./questions.json");
      displayQuestions(questions);
    } catch (errLocal) {
      console.error("Unable to load questions from backend or local file:", errLocal);
      const qEl = document.getElementById("quiz");
      if (qEl) qEl.innerHTML = `<p style="color:red;">⚠️ Unable to load questions.</p>`;
    }
  }
}

function displayQuestions(questions) {
  const quizContainer = document.getElementById("quiz");
  if (!quizContainer) return;
  quizContainer.innerHTML = "";

  questions.forEach((q, i) => {
    const block = document.createElement("div");
    block.className = "question-block";

    const h = document.createElement("h3");
    h.textContent = `${i + 1}. ${q.question}`;
    block.appendChild(h);

    (q.options || []).forEach((option) => {
      const label = document.createElement("label");
      label.style.display = "block";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${i}`;
      // store option text as value for easier comparison; we'll map numeric answers below
      input.value = option;

      label.appendChild(input);
      label.appendChild(document.createTextNode(" " + option));
      block.appendChild(label);
    });

    quizContainer.appendChild(block);
  });

  // replace submit button to remove previous listeners, then attach fresh handler
  const submitBtn = document.getElementById("submit");
  if (!submitBtn) return;
  const submitClone = submitBtn.cloneNode(true);
  submitBtn.parentNode.replaceChild(submitClone, submitBtn);

  submitClone.addEventListener("click", () => {
    let score = 0;
    questions.forEach((q, i) => {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (!selected) return;
      const selectedValue = selected.value;
      if (typeof q.answer === "number") {
        // answer provided as index -> compare text at that index
        if (q.options && q.options[q.answer] === selectedValue) score++;
      } else {
        // answer provided as text -> direct compare
        if (selectedValue === q.answer) score++;
      }
    });

    const result = document.getElementById("result");
    if (result) result.innerText = `🎯 Your score: ${score} / ${questions.length}`;
  });
}

// initialize on DOM ready
document.addEventListener("DOMContentLoaded", loadQuestions);
