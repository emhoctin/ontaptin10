// Fix: Import `Type` for response schema definition.
import { GoogleGenAI, Type } from '@google/genai';
import { Question, Attempt, AdaptiveSuggestions } from '../types';
import { SUMMARY_PROMPT_TEMPLATE, ADAPTIVE_PROMPT_TEMPLATE, EXPLANATION_PROMPT_TEMPLATE } from '../constants';

export const generateSummaryForTopic = async (
  ai: GoogleGenAI
): Promise<string> => {
  const prompt = SUMMARY_PROMPT_TEMPLATE; // Prompt is now static and comprehensive
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for summary:", error);
    throw new Error("Failed to generate summary from AI.");
  }
};

export const getAdaptiveSuggestions = async (
  ai: GoogleGenAI,
  attempts: Attempt[]
): Promise<AdaptiveSuggestions> => {
  const simplifiedAttempts = attempts.slice(-10).map(att => ({
    question_stem: att.question.stem,
    topic: att.question.topicId, // Assuming topicId links to a name
    tags: att.question.tags,
    difficulty: att.question.difficulty,
    is_correct: att.isCorrect,
  }));

  const attemptsString = JSON.stringify(simplifiedAttempts, null, 2);
  const prompt = ADAPTIVE_PROMPT_TEMPLATE.replace('{attempts}', attemptsString);

  try {
    // Fix: Use `responseSchema` to ensure a reliable JSON output from the model.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                knowledge_gaps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'List of knowledge gaps identified from incorrect answers.'
                },
                next_difficulty: {
                    type: Type.STRING,
                    description: "The recommended difficulty for the next question: 'Easy', 'Medium', or 'Hard'."
                },
                recommended_topics: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'List of related topics the student should review.'
                }
            },
            required: ['knowledge_gaps', 'next_difficulty', 'recommended_topics']
        }
      }
    });
    // Fix: With responseSchema, cleaning markdown fences is no longer necessary.
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as AdaptiveSuggestions;
  } catch (error) {
    console.error("Error calling Gemini API for adaptive suggestions:", error);
    throw new Error("Failed to get adaptive suggestions from AI.");
  }
};

export const getExplanationForQuestion = async (
  ai: GoogleGenAI,
  question: Question,
  userAnswerIndices: number[]
): Promise<string> => {
  const { stem, options, answerIndices } = question;
  
  const optionsString = JSON.stringify(options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`), null, 2);
  const correctAnswerText = answerIndices.map(i => `${String.fromCharCode(65 + i)}. ${options[i]}`).join(', ');
  const userAnswerText = userAnswerIndices.map(i => `${String.fromCharCode(65 + i)}. ${options[i]}`).join(', ');

  const filledPrompt = EXPLANATION_PROMPT_TEMPLATE
    .replace('{question}', stem)
    .replace('{options}', optionsString)
    .replace('{correctAnswerText}', correctAnswerText)
    .replace('{userAnswerText}', userAnswerText);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: filledPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for explanation:", error);
    throw new Error("Failed to generate explanation from AI.");
  }
};