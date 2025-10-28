import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Topic } from '../types';
import Card from './Card';
import { ArrowLeftIcon } from './icons';

interface SummaryScreenProps {
  topic: Topic;
  summaryContent: string;
  onBack: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ topic, summaryContent, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <button
          onClick={onBack}
          className="flex items-center text-primary font-semibold mb-6 hover:underline"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Quay lại trang chủ
        </button>
        <h1 className="text-3xl font-bold text-dark mb-4 border-b-2 border-secondary pb-2">
          Tóm tắt chủ đề: {topic.name}
        </h1>
        <div className="prose prose-lg max-w-none prose-h2:text-primary prose-strong:text-dark">
          <ReactMarkdown>{summaryContent}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
};

export default SummaryScreen;
