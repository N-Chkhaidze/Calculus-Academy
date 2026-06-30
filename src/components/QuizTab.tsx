import React from 'react';
import { Trophy, Lock, AlertCircle } from 'lucide-react';
import { CalculusQuiz } from './CalculusQuiz';
import { StudentProfile } from '../types';
import { LESSON_TOPICS } from '../data';

interface QuizTabProps {
  currentUser: StudentProfile;
  activeQuizTopicId: string | null;
  setActiveQuizTopicId: (topicId: string | null) => void;
  onQuizComplete: (scoreAdded: number, isPerfect: boolean) => void;
}

export function QuizTab({
  currentUser,
  activeQuizTopicId,
  setActiveQuizTopicId,
  onQuizComplete,
}: QuizTabProps) {
  const isTopicUnlocked = (index: number) => {
    return currentUser.unlockedLevel >= index;
  };

  const getTopicIconComponent = (iconName: string, css: string) => {
    if (iconName === 'Percent') return <span className="font-mono font-bold">lim</span>;
    if (iconName === 'TrendingUp') return <span className="font-sans font-bold">f'</span>;
    return <span className="font-mono font-bold">∫</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in select-none">
      {activeQuizTopicId === null ? (
        /* Standard Quiz Selection layout */
        <div className="space-y-6">
          <div className="text-center max-w-md mx-auto mb-6">
            <Trophy className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
              Academic Quizzes
            </h2>
            <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
              Complete the quizzes and earn 10 XP for each correct answer! A perfect score unlocks honorable badges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LESSON_TOPICS.map((topic, i) => {
              const unlocked = isTopicUnlocked(topic.index);

              const borderClass = i === 0
                ? 'border-l-4 border-l-emerald-500'
                : i === 1
                ? 'border-l-4 border-l-indigo-500'
                : 'border-l-4 border-l-purple-500';

              return (
                <div
                  key={topic.id}
                  className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between ${borderClass} ${
                    unlocked ? '' : 'opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-8 h-8 rounded-sm border flex items-center justify-center text-[10px] ${topic.colorClass}`}>
                        {getTopicIconComponent(topic.icon, "w-4 h-4")}
                      </div>
                      {!unlocked && <Lock className="w-4 h-4 text-slate-400" />}
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                      {topic.titleGe} Quiz
                    </h4>
                    <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-2 leading-relaxed">
                      {topic.index === 0 && 'Limits at infinity, approaches, and indeterminate forms.'}
                      {topic.index === 1 && 'Power rules, coefficients, and tangent lines.'}
                      {topic.index === 2 && 'Accumulation of Riemann columnar areas and antiderivatives.'}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800">
                    {unlocked ? (
                      <button
                        onClick={() => setActiveQuizTopicId(topic.id)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-150 dark:shadow-none transition-all cursor-pointer"
                      >
                        Start Quiz
                      </button>
                    ) : (
                      <div className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg text-center text-[10px] text-slate-450 dark:text-slate-500 flex items-center gap-1 bg-slate-50 dark:bg-slate-950 dark:text-slate-500 justify-center">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Render the actual Quiz Set */
        <CalculusQuiz
          topicId={activeQuizTopicId}
          topicTitleGe={LESSON_TOPICS.find(t => t.id === activeQuizTopicId)?.titleGe || ''}
          onComplete={onQuizComplete}
          onReset={() => setActiveQuizTopicId(null)}
        />
      )}
    </div>
  );
}
