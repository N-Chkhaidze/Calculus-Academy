import React from 'react';
import { Award, Trophy, Activity, Sparkles, Lock, AlertCircle, BookOpen, ChevronRight } from 'lucide-react';
import { StudentProfile, LessonTopic } from '../types';
import { LESSON_TOPICS, BADGE_DEFINITIONS } from '../data';

interface DashboardProps {
  currentUser: StudentProfile;
  setActiveTab: (tab: 'dashboard' | 'lessons' | 'quiz' | 'leaderboard' | 'sources') => void;
  setSelectedLesson: (topic: LessonTopic) => void;
  setActiveQuizTopicId: (topicId: string | null) => void;
  leaderboard: StudentProfile[];
  loadingLeaderboard: boolean;
}

export function Dashboard({
  currentUser,
  setActiveTab,
  setSelectedLesson,
  setActiveQuizTopicId,
  leaderboard,
  loadingLeaderboard,
}: DashboardProps) {
  const currentActiveTopic = LESSON_TOPICS[Math.min(currentUser.unlockedLevel, LESSON_TOPICS.length - 1)] || LESSON_TOPICS[0];

  const getBadgeIconComponent = (iconName: string, css: string) => {
    if (iconName === 'Award') return <Award className={css} />;
    return <Sparkles className={css} />;
  };

  const isTopicUnlocked = (index: number) => {
    return currentUser.unlockedLevel >= index;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in select-none">
      {/* Left Column (Topics, Active Material) */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        {/* Topics Grid */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-3.5 flex items-center gap-1.5">
            <span>📚 Calculus Chapters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LESSON_TOPICS.map((topic, i) => {
              const unlocked = isTopicUnlocked(topic.index);
              const isCompleted = currentUser.unlockedLevel > topic.index;
              const isActive = currentUser.unlockedLevel === topic.index;

              // Border colors based on theme instructions
              const borderClass = i === 0
                ? 'border-l-4 border-l-emerald-500'
                : i === 1
                ? 'border-l-4 border-l-indigo-500'
                : 'border-l-4 border-l-purple-500';

              // Calculate progress pct and design specs
              const progressPct = isCompleted ? 100 : isActive ? 50 : 0;
              const progressColor = i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-indigo-500' : 'bg-purple-500';

              return (
                <div
                  key={topic.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800/80 relative flex flex-col justify-between ${borderClass} ${
                    !unlocked ? 'opacity-70 text-slate-400 dark:text-slate-500' : ''
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Chapter {topic.index + 1}</span>
                      {!unlocked && (
                        <Lock className="w-3.5 h-3.5 text-slate-450 dark:text-slate-500 shrink-0" />
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {topic.titleGe}
                    </h4>
                    <p className="text-[10px] text-slate-550 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {topic.descriptionGe}
                    </p>
                  </div>

                  <div className="mt-5">
                    {/* Progress bar info */}
                    <div className="flex justify-between items-center text-[10px] mb-1 font-semibold text-slate-400">
                      <span>Progress</span>
                      <span>{isCompleted ? 'Completed' : isActive ? `${progressPct}%` : 'Not Started'}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
                      <div className={`h-full ${progressColor}`} style={{ width: `${progressPct}%` }} />
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      {unlocked ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedLesson(topic);
                              setActiveTab('lessons');
                            }}
                            className="text-[11px] font-semibold text-indigo-650 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            Learn <ChevronRight className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveQuizTopicId(topic.id);
                              setActiveTab('quiz');
                            }}
                            className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-300 text-[10px] font-bold rounded-lg hover:bg-indigo-100/80 dark:hover:bg-indigo-900/30 transition-all cursor-pointer"
                          >
                            Quiz
                          </button>
                        </>
                      ) : (
                        <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-slate-400" /> Requires {topic.index * 15} XP
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active / Current lesson block */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm relative">
          <div className="absolute top-6 right-6 text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-300 px-3 py-1 rounded-full tracking-wider select-none">
            Active Material
          </div>

          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Current Lesson Focus</span>
          <h4 className="text-base font-bold text-slate-900 dark:text-white font-sans leading-tight">
            {currentActiveTopic.titleGe}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {currentActiveTopic.descriptionGe}
          </p>

          <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-955/40 rounded-xl border border-dashed border-slate-300 dark:border-slate-800/60 flex items-center justify-center my-5 overflow-hidden relative">
            <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12 min-w-full md:min-w-0">
              <div>
                <div className="text-slate-400 text-[9px] uppercase font-bold tracking-widest mb-1">Active Formula</div>
                <div className="text-sm font-serif font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {currentActiveTopic.id === 'limits' && 'lim (x → c) f(x) = L'}
                  {currentActiveTopic.id === 'derivatives' && "(xⁿ)' = n • xⁿ⁻¹"}
                  {currentActiveTopic.id === 'integrals' && '∫ from a to b f(x) dx'}
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-[9px] uppercase font-bold tracking-widest mb-1">Practice Problem</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400">
                  {currentActiveTopic.id === 'limits' && 'The limit value as x approaches 3.'}
                  {currentActiveTopic.id === 'derivatives' && 'The slope of the tangent line to the graph.'}
                  {currentActiveTopic.id === 'integrals' && 'Area calculation using Riemann sums.'}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setSelectedLesson(currentActiveTopic);
                setActiveTab('lessons');
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs tracking-wide shadow-lg shadow-indigo-150 dark:shadow-none transition-all flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" /> Go to Lesson
            </button>
            <button
              onClick={() => {
                setActiveQuizTopicId(currentActiveTopic.id);
                setActiveTab('quiz');
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg font-semibold text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer"
            >
              Take Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Right Column (Leaderboard Mini, Goal, Badges) */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        {/* Leaderboard Mini */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Leaderboard</h3>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className="text-[9px] text-indigo-650 dark:text-indigo-400 font-extrabold uppercase hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {loadingLeaderboard ? (
              <div className="py-8 text-center text-xs text-slate-400 font-mono">Loading...</div>
            ) : leaderboard.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-mono">Empty</div>
            ) : (
              leaderboard.slice(0, 4).map((student, i) => {
                const isLoggedUser = student.userId === currentUser.userId;

                const rowClass = isLoggedUser
                  ? 'flex items-center justify-between p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30'
                  : 'flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-955/50 transition-colors';

                const numberClass = isLoggedUser
                  ? 'font-black text-indigo-600 dark:text-indigo-400 w-4 font-mono text-xs'
                  : 'font-bold text-slate-450 dark:text-slate-500 w-4 font-mono text-xs';

                return (
                  <div key={student.userId} className={rowClass}>
                    <div className="flex items-center space-x-3 truncate">
                      <span className={numberClass}>{i + 1}</span>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isLoggedUser ? 'bg-indigo-200 dark:bg-indigo-900 text-indigo-805 dark:text-indigo-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                        {student.displayName ? student.displayName.slice(0, 1).toUpperCase() : '👤'}
                      </div>
                      <span className={`text-xs font-bold truncate ${isLoggedUser ? 'text-indigo-800 dark:text-indigo-305' : 'text-slate-700 dark:text-slate-300'}`}>
                        {student.displayName}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold font-mono text-slate-650 dark:text-slate-400 shrink-0">
                      {student.score} XP
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Next Goal Panel */}
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-955/45 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mb-2">Next Goal</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold">
                {leaderboard.findIndex(s => s.userId === currentUser.userId) <= 2 && leaderboard.findIndex(s => s.userId === currentUser.userId) >= 0
                  ? 'Maintain #1 rank'
                  : 'Reach Top 3'}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">+120 XP</span>
            </div>
          </div>
        </div>

        {/* Badges Mini Box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">My Badges</span>
            <span className="text-[10px] font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {currentUser.badges.length}/5
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {BADGE_DEFINITIONS.map((badge) => {
              const hasBadge = currentUser.badges.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  title={`${badge.titleGe}: ${badge.descriptionGe}`}
                  className={`aspect-square rounded-lg border flex items-center justify-center transition-all ${
                    hasBadge
                      ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900 text-amber-500 hover:scale-105'
                      : 'bg-slate-50 border-slate-100 dark:bg-slate-950 dark:border-slate-850 opacity-30 text-slate-400'
                  }`}
                >
                  {getBadgeIconComponent(badge.iconName, "w-5 h-5")}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
