import React from 'react';
import { Trophy, Award, Sparkles } from 'lucide-react';
import { StudentProfile } from '../types';
import { BADGE_DEFINITIONS } from '../data';

interface LeaderboardTabProps {
  leaderboard: StudentProfile[];
  loadingLeaderboard: boolean;
  currentUser: StudentProfile;
  isFirebaseEnabled: boolean;
}

export function LeaderboardTab({
  leaderboard,
  loadingLeaderboard,
  currentUser,
  isFirebaseEnabled,
}: LeaderboardTabProps) {
  const getBadgeIconComponent = (iconName: string, css: string) => {
    if (iconName === 'Award') return <Award className={css} />;
    return <Sparkles className={css} />;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in select-none">
      <div className="text-center max-w-md mx-auto">
        <Trophy className="w-12 h-12 text-indigo-500 mx-auto mb-3 animate-bounce" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white font-sans uppercase tracking-tight">
          Academy Leaderboard
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Top 10 students based on mathematical ranking.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Status header indicating if live on Firestore cloud or falls back */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-150/50 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span className="flex items-center gap-1.5 uppercase font-mono">
            <span className={`w-2 h-2 rounded-full ${isFirebaseEnabled ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {isFirebaseEnabled ? 'Firebase Firestore Synced' : 'Local Ranking Network'}
          </span>
          <span>Top 10 Students</span>
        </div>

        {loadingLeaderboard ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-650 border-t-white/30 mx-auto mb-2" />
            <span className="text-xs text-slate-450 dark:text-slate-500 font-mono">Loading rankings...</span>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center text-slate-450 text-xs">
            The leaderboard is empty.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {leaderboard.map((student, i) => {
              const isLoggedUser = student.userId === currentUser.userId;

              let medal = (
                <span className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-xs flex items-center justify-center text-slate-550 dark:text-slate-400">
                  {i + 1}
                </span>
              );

              if (i === 0) medal = <span className="w-6 h-6 rounded bg-amber-50 dark:bg-amber-950/30 text-amber-500 dark:text-amber-400 font-bold text-sm flex items-center justify-center">🥇</span>;
              if (i === 1) medal = <span className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-300 font-bold text-sm flex items-center justify-center">🥈</span>;
              if (i === 2) medal = <span className="w-6 h-6 rounded bg-amber-50/50 dark:bg-amber-900/10 text-orange-400 dark:text-orange-300 font-bold text-sm flex items-center justify-center">🥉</span>;

              return (
                <div
                  key={student.userId}
                  className={`px-6 py-4 flex items-center justify-between gap-4 transition-all duration-150 ${
                    isLoggedUser
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/20 shadow-inner'
                      : 'hover:bg-slate-50/50 dark:hover:bg-slate-950/10'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {medal}

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isLoggedUser ? 'text-indigo-750 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-200'}`}>
                          {student.displayName}
                        </span>
                        {isLoggedUser && (
                          <span className="text-[8px] bg-indigo-100 dark:bg-indigo-950/50 px-2 py-0.5 rounded font-mono text-indigo-750 dark:text-indigo-305 uppercase font-black">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="block text-[9px] text-slate-400 capitalize mt-0.5" id={`leaderboard-student-level-${i}`}>
                        {student.unlockedLevel === 0 && 'Limits Pioneer'}
                        {student.unlockedLevel === 1 && 'Derivatives Conqueror'}
                        {student.unlockedLevel === 2 && 'Integrals Professor'}
                        {student.unlockedLevel >= 3 && 'Academy Master 🎓'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 font-mono">
                    <div className="flex gap-1">
                      {student.badges.slice(0, 3).map((bId) => {
                        const bDef = BADGE_DEFINITIONS.find(b => b.id === bId);
                        if (!bDef) return null;
                        return (
                          <div
                            key={bId}
                            title={bDef.titleGe}
                            className="w-4.5 h-4.5 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-850"
                          >
                            {getBadgeIconComponent(bDef.iconName, "w-2.5 h-2.5 text-amber-500")}
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      ⭐ {student.score} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-150/40 dark:border-slate-850 text-[10px] text-slate-400 leading-relaxed text-center">
        💡 Retaking quizzes allows you to improve your ranking and secure the #1 position in the academy!
      </div>
    </div>
  );
}
