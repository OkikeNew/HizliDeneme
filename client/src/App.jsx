import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [inputText, setInputText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [question, setQuestion] = useState("Soru 1: İstanbul hangi ülkededir?");
  const [answer, setAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showHearts, setShowHearts] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [allCorrect, setAllCorrect] = useState(false);

  const questions = [
    {
      question: "Soru 1:Tolga'nın en sevdiği tatlı?",
      answer: "Aslı",
    },
    {
      question: "Soru 2: Gelmiş geçmiş en tatlı insan?",
      answer: "Aslı",
    },
  ];

  useEffect(() => {
    if (showHearts) {
      setTimeout(() => {
        setShowHearts(false);
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
        setAttemptNumber((prev) => prev + 1);
      }, 5000);
    }
  }, [showHearts]);

  const handleSave = async () => {
    await fetch("http://localhost:5000/save-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question: questions[currentQuestionIndex].question,
        answer,
        correct: answer.trim().toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase(),
        attemptNumber,
      }),
    });
    alert("Veri kaydedildi!");
  };

  const handleFetch = async () => {
    const response = await fetch("http://localhost:5000/get-answers");
    const data = await response.json();
    setResponseText(data.map((item) => `${item.attemptNumber}. Deneme: ${item.question} - Cevap: ${item.answer}`).join("\n"));
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 10000);
  };

  const handleAnswerCheck = () => {
    const correct = answer.trim().toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase();
    if (correct) {
      setShowHearts(true);
    } else {
      alert("Cevap yanlış, tekrar deneyin.");
    }

    setUserAnswers((prev) => [
      ...prev,
      {
        question: questions[currentQuestionIndex].question,
        answer: answer,
        correct,
      },
    ]);

    setAnswer("");

    // Check if all answers are correct
    if (userAnswers.length + 1 === questions.length && !userAnswers.some((ans) => !ans.correct)) {
      setAllCorrect(true);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex === questions.length) {
      setTimeout(() => {
        handleFetch();
      }, 2000);
    }
  }, [currentQuestionIndex]);

  return (
    <div className="container">
      {allCorrect ? (
        <div className="congratulations">
          <h2>Tebrik ederim!</h2>
        </div>
      ) : (
        <>
          <h1 className="title">Aşkıma sorular</h1>

          <div className="question-container">
            <div className="question">{questions[currentQuestionIndex].question}</div>
          </div>

          <div className="input-container">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Cevabınızı yazın..."
              className="input"
            />
          </div>

          <div className="button-container">
            <button className="button check" onClick={handleAnswerCheck}>
              Cevabı Gönder
            </button>
          </div>

          {showHearts && (
            <div className="hearts">
              {[...Array(30)].map((_, index) => (
                <span
                  key={index}
                  role="img"
                  aria-label="love"
                  className="heart"
                  style={{
                    animationDelay: `${Math.random() * 2}s`,
                    left: `${Math.random() * 100}vw`,
                    top: `${Math.random() * 100}vh`,
                  }}
                >
                  ❤️
                </span>
              ))}
            </div>
          )}

          {showPopup && (
            <div className="popup">
              <pre>{responseText}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
