import React from 'react';
import { Topic } from '../types';
import Card from './Card';
import { AcademicCapIcon, BookOpenIcon, BoltIcon } from './icons';

interface HomeScreenProps {
  topics: Topic[];
  onStartQuiz: (topic: Topic) => void;
  onViewSummary: (topic: Topic) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ topics, onStartQuiz, onViewSummary }) => {
  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Chào mừng đến với Tin Học 10 !</h1>
        <p className="text-lg text-dark/80">Nâng cao kiến thức Tin học lớp 10 với sự trợ giúp của AI.</p>
      </Card>
      
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Chọn một chủ đề để bắt đầu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map(topic => (
            <Card key={topic.id} className="flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
              <div>
                <div className="flex items-center mb-3">
                    <AcademicCapIcon className="w-7 h-7 text-primary mr-3 flex-shrink-0"/>
                    <h3 className="text-xl font-bold text-dark">{topic.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-6 min-h-[60px]">{topic.description}</p>
              </div>
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => onViewSummary(topic)}
                  className="w-full bg-white border-2 border-primary text-primary font-bold py-2 px-4 rounded-lg shadow-sm hover:bg-primary/10 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <BookOpenIcon className="w-5 h-5"/>
                  <span>AI Tóm tắt</span>
                </button>
                <button
                  onClick={() => onStartQuiz(topic)}
                  className="w-full bg-secondary text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-orange-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                    <BoltIcon className="w-5 h-5"/>
                    <span>Luyện tập</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;