import React, { useState, useEffect } from 'react';
import questions from './questions'; // Assuming you have questions exported from a separate file
import './App.css'; // Optional: Create a CSS file for styling

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");

  // Timer logic
  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAnswerSubmit();
    }
  }, [timeLeft, quizStarted]);

  const handleAnswerSubmit = () => {
    setUserAnswers([...userAnswers, selectedAnswer]);

    if (selectedAnswer === filteredQuestions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < filteredQuestions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedAnswer(null);
      setTimeLeft(10);
    } else {
      setShowScore(true);
    }
  };

  const handleSkip = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < filteredQuestions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedAnswer(null);
      setTimeLeft(10);
    } else {
      setShowScore(true);
    }
  };

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setTimeLeft(10);
    setQuizStarted(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  // Filter questions based on selected difficulty
  const filteredQuestions = questions.filter((question) => question.difficulty === selectedDifficulty);

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        <div className="start-quiz">
          <h2>Welcome to the Quiz!</h2>

          {/* Difficulty Selection */}
                        <div class="difficulty-select">
                <label for="difficulty">Choose Difficulty:</label>
                <select id="difficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
                </div>

          <button className="start-button" onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      ) : (
        <>
          {/* Question Display */}
          <div className="question-section">
            <h3>Question {currentQuestionIndex + 1}</h3>
            <p>{filteredQuestions[currentQuestionIndex].question}</p>

            <div className="options-section">
              {filteredQuestions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${
                    selectedAnswer === option ? 'selected' : ''
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              className="submit-button"
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>

            <button className="skip-button" onClick={handleSkip}>
              Skip Question
            </button>
          </div>
        </>
      )}

      {showScore && (
        <div className="score-section">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} out of {filteredQuestions.length}</p>
          <button className="restart-button" onClick={restartQuiz}>
            Restart Quiz
          </button>

          <div className="review-section">
            <h3>Review Your Answers:</h3>
            <ul>
              {filteredQuestions.map((question, index) => (
                <li key={index} className="review-item">
                  <p><strong>Q{index + 1}:</strong> {question.question}</p>
                  <p>
                    <span
                      className={
                        userAnswers[index] === question.answer
                          ? 'correct'
                          : 'incorrect'
                      }
                    >
                      Your Answer: {userAnswers[index] || 'Skipped'}
                    </span>
                  </p>
                  <p>Correct Answer: {question.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
