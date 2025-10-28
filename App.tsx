
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

// Import components
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import { QuizScreen } from './components/QuizScreen';
import SummaryScreen from './components/SummaryScreen';
import SessionEndScreen from './components/SessionEndScreen';
import { LoadingSpinner } from './components/LoadingSpinner';

// Import data and types
import { MOCK_CS_TOPICS } from './data/cs_topics';
import { MOCK_CS_QUESTIONS } from './data/cs_questions';
import { Topic, Question, Attempt, AdaptiveSuggestions } from './types';

// Import services
import { generateSummaryForTopic, getAdaptiveSuggestions } from './services/geminiService';

// Main App Component
const App: React.FC = () => {
    // State management
    const [ai, setAi] = useState<GoogleGenAI | null>(null);
    const [appState, setAppState] = useState<'home' | 'quiz' | 'summary' | 'session-end'>('home');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
    const [summaryContent, setSummaryContent] = useState('');
    const [quizAttempts, setQuizAttempts] = useState<Attempt[]>([]);
    const [adaptiveSuggestions, setAdaptiveSuggestions] = useState<AdaptiveSuggestions | null>(null);

    // Initialize Gemini AI client
    useEffect(() => {
        // Fix: Use `process.env.API_KEY` as per coding guidelines, which also resolves the TypeScript error on line 35.
        const apiKey = process.env.API_KEY;
        if (apiKey) {
            const genAI = new GoogleGenAI({ apiKey });
            setAi(genAI);
        } else {
            console.error("API_KEY environment variable not set.");
        }
    }, []);

    const questionsByTopic = useMemo(() => {
        return MOCK_CS_QUESTIONS.reduce((acc, q) => {
            if (!acc[q.topicId]) {
                acc[q.topicId] = [];
            }
            acc[q.topicId].push(q);
            return acc;
        }, {} as Record<string, Question[]>);
    }, []);

    const handleViewSummary = async (topic: Topic) => {
        if (!ai) return;
        setIsLoading(true);
        setSelectedTopic(topic);
        setAppState('summary');
        try {
            // Using a single comprehensive prompt as defined in constants
            const summary = await generateSummaryForTopic(ai);
            setSummaryContent(summary);
        } catch (error) {
            console.error("Failed to generate summary:", error);
            setSummaryContent("Đã có lỗi xảy ra khi tạo bản tóm tắt. Vui lòng thử lại.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStartQuiz = (topic: Topic) => {
        const allTopicQuestions = questionsByTopic[topic.id] || [];

        // Shuffle all questions for the topic to pick a random subset
        const shuffledAllQuestions = [...allTopicQuestions].sort(() => Math.random() - 0.5);

        // Determine the number of questions for the quiz - NOW ALWAYS 20
        const questionCount = 20;

        // Select the subset of questions (slice will handle cases where there are fewer than 20)
        const selectedQuestions = shuffledAllQuestions.slice(0, questionCount);

        // Shuffle answers for each selected question
        const questionsWithShuffledAnswers = selectedQuestions.map(question => {
            // Create an array of options with their original index
            const optionsWithOriginalIndex = question.options.map((option, index) => ({
                text: option,
                originalIndex: index
            }));

            // Shuffle this array
            const shuffledOptionsWithOriginalIndex = [...optionsWithOriginalIndex].sort(() => Math.random() - 0.5);

            // Create the new options array from the shuffled one
            const newOptions = shuffledOptionsWithOriginalIndex.map(opt => opt.text);

            // Create the new answer indices array by finding the new position of the original correct answers
            const newAnswerIndices = question.answerIndices.map(correctOriginalIndex => {
                return shuffledOptionsWithOriginalIndex.findIndex(opt => opt.originalIndex === correctOriginalIndex);
            });

            // Return the new question object with shuffled options and updated answer indices
            return {
                ...question,
                options: newOptions,
                answerIndices: newAnswerIndices.sort((a, b) => a - b) // Keep indices sorted for easier comparison later
            };
        });

        setQuizQuestions(questionsWithShuffledAnswers);
        setSelectedTopic(topic);
        setQuizAttempts([]);
        setAdaptiveSuggestions(null);
        setAppState('quiz');
    };

    const handleQuizEnd = async (attempts: Attempt[]) => {
        if (!ai) return;
        setQuizAttempts(attempts);
        setIsLoading(true); // Show loading while fetching suggestions
        setAppState('session-end');
        try {
            const suggestions = await getAdaptiveSuggestions(ai, attempts);
            setAdaptiveSuggestions(suggestions);
        } catch (error) {
            console.error("Failed to get adaptive suggestions:", error);
            setAdaptiveSuggestions(null); // Clear suggestions on error
        } finally {
            setIsLoading(false);
        }
    };
    
    const goHome = () => {
        setAppState('home');
        setSelectedTopic(null);
        setQuizAttempts([]);
        setAdaptiveSuggestions(null);
        setSummaryContent('');
    };
    
    const handlePracticeAgain = () => {
        if (selectedTopic) {
            handleStartQuiz(selectedTopic);
        } else {
            goHome();
        }
    };

    const renderContent = () => {
        // Main loading state for summary generation
        if (isLoading && appState !== 'session-end') {
            return (
                <div className="flex justify-center items-center py-20">
                    <LoadingSpinner />
                </div>
            );
        }

        switch (appState) {
            case 'quiz':
                return (selectedTopic && quizQuestions.length > 0 && ai) ? (
                    <QuizScreen 
                        topic={selectedTopic} 
                        questions={quizQuestions} 
                        onQuizEnd={handleQuizEnd} 
                        ai={ai}
                        onRestartQuiz={handleStartQuiz}
                        goHome={goHome}
                    />
                ) : <p>Lỗi khi bắt đầu bài kiểm tra. Vui lòng thử lại.</p>;
            case 'summary':
                return selectedTopic ? (
                     <SummaryScreen 
                        topic={selectedTopic} 
                        summaryContent={summaryContent} 
                        onBack={goHome} 
                    />
                ) : <p>Lỗi khi tải tóm tắt. Vui lòng thử lại.</p>;
            case 'session-end':
                return (
                    <SessionEndScreen 
                        attempts={quizAttempts} 
                        suggestions={adaptiveSuggestions}
                        onRestart={goHome}
                        onPracticeAgain={handlePracticeAgain}
                    />
                );
            case 'home':
            default:
                return (
                    <HomeScreen 
                        topics={MOCK_CS_TOPICS} 
                        onStartQuiz={handleStartQuiz} 
                        onViewSummary={handleViewSummary} 
                    />
                );
        }
    };
    
    return (
        <div className="bg-light min-h-screen font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-6">
                {/* Fix: Updated error message to not instruct the user on how to set the API key, per guidelines. */}
                {!ai && <div className="text-center text-red-600 font-bold p-4 bg-red-100 rounded-lg">Lỗi: API Key chưa được cấu hình.</div>}
                {ai && renderContent()}
            </main>
        </div>
    );
};

export default App;
