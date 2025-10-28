
import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Topic, Question, Attempt } from '../types';
import { getExplanationForQuestion } from '../services/geminiService';
import Card from './Card';
import ResultsScreen from './ResultsScreen';
import { ArrowLeftIcon, SparklesIcon, ArrowPathIcon, HomeIcon } from './icons';

interface QuizScreenProps {
  topic: Topic;
  questions: Question[];
  onQuizEnd: (attempts: Attempt[]) => void;
  ai: GoogleGenAI;
  onRestartQuiz: (topic: Topic) => void;
  goHome: () => void;
}

// Fix: Changed component to a named export to resolve module issue.
export const QuizScreen: React.FC<QuizScreenProps> = ({ topic, questions, onQuizEnd, ai, onRestartQuiz, goHome }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  const handleOptionToggle = (optionIndex: number) => {
    if (showResult) return;
    
    const isMultiSelect = currentQuestion.answerIndices.length > 1;
    if (isMultiSelect) {
        setSelectedIndices(prev => 
            prev.includes(optionIndex) 
                ? prev.filter(i => i !== optionIndex) 
                : [...prev, optionIndex]
        );
    } else {
        setSelectedIndices([optionIndex]);
    }
  };

  const handleSubmit = () => {
    if (selectedIndices.length === 0) return;

    const correctIndices = currentQuestion.answerIndices.sort();
    const userIndices = [...selectedIndices].sort();
    
    const isCorrect = JSON.stringify(correctIndices) === JSON.stringify(userIndices);

    const newAttempt: Attempt = {
      question: currentQuestion,
      userAnswerIndices: selectedIndices,
      isCorrect,
    };

    setAttempts(prev => [...prev, newAttempt]);
    setShowResult(true);
  };
  
  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex >= questions.length - 1;

    if (isLastQuestion) {
      setIsQuizFinished(true);
    } else {
      setShowResult(false);
      setSelectedIndices([]);
      setExplanation(null);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleGetExplanation = async () => {
    setIsExplanationLoading(true);
    try {
      const expl = await getExplanationForQuestion(ai, currentQuestion, selectedIndices);
      setExplanation(expl);
    } catch (error) {
      console.error("Failed to get explanation:", error);
      setExplanation("Xin lỗi, đã có lỗi xảy ra khi tạo giải thích.");
    } finally {
      setIsExplanationLoading(false);
    }
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (isQuizFinished) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Chúc mừng!</h2>
          <p className="text-lg text-dark/80 mb-8">Bạn đã hoàn thành tất cả các câu hỏi trong chủ đề "{topic.name}".</p>
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => onQuizEnd(attempts)}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <SparklesIcon className="w-6 h-6"/>
              <span>Xem AI Thống kê</span>
            </button>
            <button
              onClick={() => onRestartQuiz(topic)}
              className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <ArrowPathIcon className="w-6 h-6"/>
              <span>Làm bài tiếp</span>
            </button>
             <button
              onClick={goHome}
              className="w-full bg-white border-2 border-gray-300 text-dark font-bold py-3 px-4 rounded-lg shadow-sm hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <HomeIcon className="w-6 h-6"/>
              <span>Quay về</span>
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <div className="mb-6">
             <button onClick={goHome} className="flex items-center text-primary font-semibold mb-6 hover:underline">
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Quay về
            </button>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-dark">{topic.name}</h2>
            <span className="text-gray-600 font-semibold">{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        <div>
          <p className="text-lg font-semibold mb-4 text-dark">{currentQuestionIndex + 1}. {currentQuestion.stem}</p>
          <div>
          {currentQuestion.answerIndices.length > 1 && <p className="text-sm text-green-600 mt-2">Câu hỏi này có nhiều đáp án.</p>}
        </div>
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionToggle(index)}
                disabled={showResult}
                className={`w-full text-left p-4 border-2 rounded-lg transition-all duration-200
                  ${selectedIndices.includes(index) ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'}
                  ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
              </button>
            ))}
          

        {showResult && attempts[currentQuestionIndex] && (
          <ResultsScreen
            attempt={attempts[currentQuestionIndex]}
            explanation={explanation}
            isExplanationLoading={isExplanationLoading}
            onGetExplanation={handleGetExplanation}
          />
        )}

               <div className="mt-8 flex justify-end">
          {!showResult ? (
            <button
              onClick={handleSubmit}
              disabled={selectedIndices.length === 0}
              className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Kiểm tra
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="bg-secondary text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành'}
            </button>
          )}
        </div>
      </Card> {/* ✅ Đóng thẻ Card đúng vị trí */}
    </div>   {/* ✅ Đóng div tổng */}
  );
};
