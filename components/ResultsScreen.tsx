import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Attempt } from '../types';
import Card from './Card';
import { LoadingSpinner } from './LoadingSpinner';
import { CheckCircleIcon, XCircleIcon, SparklesIcon } from './icons';


interface ResultsScreenProps {
  attempt: Attempt;
  explanation: string | null;
  isExplanationLoading: boolean;
  onGetExplanation: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ attempt, explanation, isExplanationLoading, onGetExplanation }) => {
  const { question, userAnswerIndices, isCorrect } = attempt;

  return (
    <div className="mt-6 border-t-2 pt-6">
        <div className="flex items-center mb-4">
            {isCorrect ? (
                <CheckCircleIcon className="w-8 h-8 text-green-600 mr-3" />
            ) : (
                <XCircleIcon className="w-8 h-8 text-red-600 mr-3" />
            )}
            <h3 className={`text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'Chính xác!' : 'Chưa chính xác'}
            </h3>
        </div>
        
        <div className="mb-4">
            <p className="font-semibold text-dark mb-2">Đáp án đúng là:</p>
            <div className="space-y-2">
                {question.answerIndices.map((answerIndex) => (
                    <div key={answerIndex} className={`p-3 border-2 rounded-lg border-green-500 bg-green-50 text-green-800`}>
                         <span className="font-bold">{String.fromCharCode(65 + answerIndex)}.</span> {question.options[answerIndex]}
                    </div>
                ))}
            </div>
            {!isCorrect && userAnswerIndices.length > 0 && (
                <div className="mt-3">
                    <p className="font-semibold text-dark mb-2">Câu trả lời của bạn:</p>
                     <div className="space-y-2">
                        {userAnswerIndices.map((userIndex) => (
                            <div key={userIndex} className={`p-3 border-2 rounded-lg border-red-500 bg-red-50 text-red-800`}>
                                 <span className="font-bold">{String.fromCharCode(65 + userIndex)}.</span> {question.options[userIndex]}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {!explanation && !isExplanationLoading && (
            <button
                onClick={onGetExplanation}
                className="w-full bg-white border-2 border-primary text-primary font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-primary/10 transition-all duration-300 flex items-center justify-center space-x-2 mt-4"
            >
                <SparklesIcon className="w-5 h-5"/>
                <span>Xem giải thích từ AI</span>
            </button>
        )}

        {isExplanationLoading && (
            <div className="flex justify-center items-center mt-4 p-4">
                <LoadingSpinner />
            </div>
        )}

        {explanation && (
            <Card className="mt-4 bg-light">
                <h4 className="text-lg font-bold text-primary mb-2 flex items-center">
                    <SparklesIcon className="w-6 h-6 mr-2"/>
                    Giải thích từ AI
                </h4>
                 <div className="prose max-w-none prose-p:my-2">
                    <ReactMarkdown>{explanation}</ReactMarkdown>
                 </div>
            </Card>
        )}
    </div>
  );
};

export default ResultsScreen;
