import React from 'react';
import { Attempt, AdaptiveSuggestions } from '../types';
import Card from './Card';
import { CheckCircleIcon, XCircleIcon, SparklesIcon, ArrowPathIcon, LightBulbIcon, HomeIcon } from './icons';

interface SessionEndScreenProps {
  attempts: Attempt[];
  suggestions: AdaptiveSuggestions | null;
  onRestart: () => void;
  onPracticeAgain: () => void;
}

const SessionEndScreen: React.FC<SessionEndScreenProps> = ({ attempts, suggestions, onRestart, onPracticeAgain }) => {
  const correctAnswers = attempts.filter(r => r.isCorrect).length;
  const totalQuestions = attempts.length;
  const score = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="text-center mb-8 bg-gradient-to-r from-primary to-blue-500 text-white shadow-xl">
        <h1 className="text-4xl font-extrabold mb-2">Kết thúc phiên luyện tập</h1>
        <p className="text-2xl font-semibold mb-4">{`Bạn đã trả lời ${totalQuestions} câu, đúng ${correctAnswers} câu`}</p>
        <div className="text-5xl font-bold mb-4">{score.toFixed(0)}<span className="text-3xl">%</span></div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* AI Suggestions Card */}
        <Card>
            <h2 className="text-2xl font-bold text-dark mb-4 flex items-center">
                <SparklesIcon className="w-7 h-7 text-secondary mr-3"/>
                Gợi ý từ Gia sư AI
            </h2>
            {suggestions ? (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-lg text-primary">Lỗ hổng kiến thức</h3>
                        {suggestions.knowledge_gaps.length > 0 ? (
                             <ul className="list-disc list-inside text-dark/90 pl-2">
                                {suggestions.knowledge_gaps.map((gap, i) => <li key={i}>{gap}</li>)}
                            </ul>
                        ) : <p className="text-dark/80 italic">Không phát hiện lỗ hổng kiến thức lớn. Làm tốt lắm!</p>}
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg text-primary">Mức độ khó đề xuất</h3>
                        <p className="text-dark/90">{suggestions.next_difficulty}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg text-primary">Chủ đề nên ôn tập</h3>
                         {suggestions.recommended_topics.length > 0 ? (
                            <ul className="list-disc list-inside text-dark/90 pl-2">
                                {suggestions.recommended_topics.map((topic, i) => <li key={i}>{topic}</li>)}
                            </ul>
                         ) : <p className="text-dark/80 italic">Tuyệt vời, bạn đã nắm vững chủ đề này!</p>}
                    </div>
                </div>
            ) : (
                <p className="text-dark/80 italic">Đang phân tích kết quả của bạn...</p>
            )}
        </Card>

        {/* Attempts Review Card */}
        <Card>
             <h2 className="text-2xl font-bold text-dark mb-4 flex items-center">
                <LightBulbIcon className="w-7 h-7 text-secondary mr-3"/>
                Xem lại câu trả lời
            </h2>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {attempts.map((attempt, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md bg-light">
                        <p className="flex-1 truncate pr-4">{index + 1}. {attempt.question.stem}</p>
                        {attempt.isCorrect ? 
                            <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" /> : 
                            <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0" />
                        }
                    </div>
                ))}
            </div>
        </Card>
      </div>
      
      <div className="mt-10 flex justify-center items-center space-x-4">
        <button
          onClick={onPracticeAgain}
          className="bg-secondary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto"
        >
          <ArrowPathIcon className="w-6 h-6 mr-2"/>
          Làm bài tiếp
        </button>
        <button
          onClick={onRestart}
          className="bg-white border-2 border-gray-300 text-dark font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto"
        >
          <HomeIcon className="w-6 h-6 mr-2"/>
          Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default SessionEndScreen;