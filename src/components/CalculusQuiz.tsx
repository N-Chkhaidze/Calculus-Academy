import React, { useState } from 'react';
import { QuizQuestion, QuizSet } from '../types';
import { QUIZ_SETS } from '../data';
import { CheckCircle2, XCircle, AlertCircle, Sparkles, RefreshCw, Trophy, ArrowRight } from 'lucide-react';

interface CalculusQuizProps {
  topicId: string;
  topicTitleGe: string;
  onComplete: (scoreAdded: number, isPerfect: boolean) => void;
  onReset: () => void;
}

export function CalculusQuiz({ topicId, topicTitleGe, onComplete, onReset }: CalculusQuizProps) {
  // Find current quiz set
  const quizSet = QUIZ_SETS.find(q => q.topicId === topicId);
  const questions: QuizQuestion[] = quizSet ? quizSet.questions : [];

  // State
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [pointsHistory, setPointsHistory] = useState<number[]>([]); // track points earned/lost per question
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <p className="text-sm text-slate-505">Quiz materials not found.</p>
        <button onClick={onReset} className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs cursor-pointer">
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAns(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedAns === null || isAnswered) return;

    const isCorrect = selectedAns === currentQuestion.correctIndex;
    const gained = isCorrect ? 10 : -5;
    
    setPointsHistory([...pointsHistory, gained]);
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      // Finished all questions!
      const totalPointsAdded = pointsHistory.reduce((a, b) => a + b, 0);
      const isPerfect = correctCount === questions.length;
      setQuizFinished(true);
      onComplete(totalPointsAdded, isPerfect);
    }
  };

  // Re-start handler
  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setPointsHistory([]);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
      
      {!quizFinished ? (
        <div>
          {/* Progress bar and header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              📝 {topicTitleGe} • Quiz
            </span>
            <span className="text-xs font-mono text-slate-400">
              Question {currentIdx + 1}/{questions.length}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6">
            <div 
              className="bg-indigo-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              id="quiz-slide-progress-bar"
            />
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 font-sans" id="quiz-question-text">
              {currentQuestion.questionTextGe}
            </h3>
          </div>

          {/* Options List */}
          <div className="space-y-3 mb-6" id="quiz-options-wrapper">
            {currentQuestion.optionsGe.map((option, idx) => {
              
              // Styling states
              let buttonStyle = 'border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900';
              let iconElement = null;

              if (selectedAns === idx) {
                // selected but not graded yet
                buttonStyle = 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-100 dark:ring-indigo-950/40';
              }

              if (isAnswered) {
                if (idx === currentQuestion.correctIndex) {
                  // correct choice
                  buttonStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-indigo-300 ring-2 ring-emerald-100 dark:ring-emerald-950/40 font-medium';
                  iconElement = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
                } else if (selectedAns === idx) {
                  // user chose wrong option
                  buttonStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 ring-2 ring-rose-100 dark:ring-rose-950/40';
                  iconElement = <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
                } else {
                  // unselected and not correct
                  buttonStyle = 'border-slate-100 dark:border-slate-900 opacity-50 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all flex items-center justify-between gap-3 ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-850 text-[11px] font-mono font-bold flex items-center justify-center text-slate-500">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </div>
                  {iconElement}
                </button>
              );
            })}
          </div>

          {/* Explanation panel */}
          {isAnswered && (
            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850/80 animate-fade-in text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>Mathematical Explanation (Calculus):</span>
                {pointsHistory[currentIdx] > 0 ? (
                  <span className="ml-auto text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    +10 XP!
                  </span>
                ) : (
                  <span className="ml-auto text-rose-600 dark:text-rose-400 font-mono font-bold text-xs bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded">
                    -5 XP!
                  </span>
                )}
              </div>
              <p>{currentQuestion.explanationGe}</p>
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-end">
            {!isAnswered ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedAns === null}
                className={`px-5 py-2.5 rounded-xl font-medium text-xs tracking-wide transition-all shadow-sm ${
                  selectedAns === null
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800'
                    : 'bg-indigo-650 hover:bg-indigo-700 text-white hover:shadow cursor-pointer'
                }`}
                id="quiz-verify-btn"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-900 dark:hover:bg-white rounded-xl font-medium text-xs tracking-wide transition-all flex items-center gap-1.5 cursor-pointer"
                id="quiz-next-btn"
              >
                <span>{currentIdx < questions.length - 1 ? 'Next Question' : 'Show Results'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="text-center py-6">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 rounded-full flex items-center justify-center mx-auto text-amber-500">
              <Trophy className="w-8 h-8" />
            </div>
            {correctCount === questions.length && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white p-1 rounded-full text-[10px] shadow animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1" id="quiz-final-score-title">
            {correctCount === questions.length ? '🎉 Perfect Score!' : 'Quiz Completed!'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            You successfully answered <span className="font-semibold text-slate-700 dark:text-slate-200">{correctCount} / {questions.length}</span> questions.
          </p>

          <div className="max-w-xs mx-auto grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-250/20 p-3 rounded-xl">
              <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Total Score</div>
              <div className="text-lg font-bold font-mono text-indigo-500">
                {pointsHistory.reduce((a, b) => a + b, 0) > 0 ? '+' : ''}
                {pointsHistory.reduce((a, b) => a + b, 0)} XP
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-250/20 p-3 rounded-xl">
              <div className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Accuracy</div>
              <div className="text-lg font-bold font-mono text-emerald-500">
                {Math.round((correctCount / questions.length) * 100)}%
              </div>
            </div>
          </div>

          {/* Results check breakdown */}
          <div className="max-w-xs mx-auto space-y-2 text-left text-xs mb-8">
            {questions.map((q, i) => (
              <div key={i} className="flex items-center gap-2 p-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-lg">
                <span className={`w-2 h-2 rounded-full ${pointsHistory[i] > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="truncate text-slate-600 dark:text-slate-400">{q.questionTextGe}</span>
                <span className="ml-auto font-mono text-slate-400 font-bold">{pointsHistory[i] > 0 ? '+10' : '-5'}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 transition-all flex items-center gap-1.5 cursor-pointer"
              id="quiz-restart-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-850 text-white dark:text-slate-950 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              id="quiz-back-btn"
            >
              Go Back
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
