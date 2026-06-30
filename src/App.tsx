import React, { useState, useEffect } from 'react';
import { 
  AppService, 
  StudentProfile, 
  isFirebaseEnabled 
} from './firebase';
import { LessonTopic } from './types';
import { LESSON_TOPICS, BADGE_DEFINITIONS } from './data';
import { Confetti } from './components/Confetti';
import { Dashboard } from './components/Dashboard';
import { LessonsTab } from './components/LessonsTab';
import { QuizTab } from './components/QuizTab';
import { LeaderboardTab } from './components/LeaderboardTab';
import { SourcesTab } from './components/SourcesTab';
import {
  BookOpen,
  Award,
  Trophy,
  Activity,
  LogOut,
  Mail,
  Lock,
  User,
  CheckCircle,
  Clock,
  Sparkles,
  Compass,
  TrendingUp,
  Layers,
  ChevronRight,
  Menu,
  X,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Auth state
  const [currentUser, setCurrentUser] = useState<StudentProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  
  // Auth forms state
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [authName, setAuthName] = useState<string>('');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [authSuccess, setAuthSuccess] = useState<string>('');
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  // App routing/tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lessons' | 'quiz' | 'leaderboard' | 'sources'>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState<LessonTopic>(LESSON_TOPICS[0]);
  const [activeQuizTopicId, setActiveQuizTopicId] = useState<string | null>(null);

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState<StudentProfile[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState<boolean>(false);

  // Gamified alerts
  const [earnedBadgeAlert, setEarnedBadgeAlert] = useState<any | null>(null);
  const [pointsToast, setPointsToast] = useState<{ amount: number; message: string } | null>(null);
  const [showPerfectConfetti, setShowPerfectConfetti] = useState<boolean>(false);

  // Mobile menu toggler
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Subscription to auth state on mount
  useEffect(() => {
    const unsubscribe = AppService.subscribeToAuth((user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch leaderboard when leaderboard tab is active and user is signed in
  useEffect(() => {
    if (currentUser && (activeTab === 'leaderboard' || activeTab === 'dashboard')) {
      fetchLeaderboardData();
    } else if (!currentUser) {
      setLeaderboard([]);
    }
  }, [activeTab, currentUser?.score, currentUser !== null]);

  const fetchLeaderboardData = async () => {
    setLoadingLeaderboard(true);
    try {
      const top = await AppService.getTopStudents();
      setLeaderboard(top);
    } catch (e) {
      console.error("Could not fetch leaderboard.", e);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // Auth actions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    
    const email = authEmail.trim();
    const password = authPassword.trim();
    const name = authName.trim();

    if (!email || !password || (isSignUp && !name)) {
      setAuthError('Please fill out all fields!');
      return;
    }

    setBtnLoading(true);
    try {
      if (isSignUp) {
        const profile = await AppService.registerStudent(name, email, password);
        setCurrentUser(profile);
        setAuthSuccess('Registration completed successfully!');
        triggerBadgeUnlockAlert('calculus_novice');
      } else {
        const profile = await AppService.loginStudent(email, password);
        setCurrentUser(profile);
        setAuthSuccess('Login successful!');
      }
    } catch (err: any) {
      setAuthError(err.message || 'An error occurred during authentication.');
    } finally {
      setBtnLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AppService.logoutStudent();
      setCurrentUser(null);
      setActiveTab('dashboard');
      // Reset inputs
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
      setAuthError('');
    } catch (e) {
      console.error("Failed to sign out.", e);
    }
  };

  // Progress update caller when quiz is completed
  const handleQuizCompletion = async (pointsGained: number, isPerfect: boolean) => {
    if (!currentUser) return;

    // Determine badge unlocking
    let newlyUnlockedBadge: string | undefined = undefined;
    if (isPerfect) {
      if (activeQuizTopicId === 'limits') newlyUnlockedBadge = 'limits_master';
      if (activeQuizTopicId === 'derivatives') newlyUnlockedBadge = 'derivatives_master';
      if (activeQuizTopicId === 'integrals') newlyUnlockedBadge = 'integrals_master';
    }

    // Unleash Confetti particles if perfect score
    if (isPerfect) {
      setShowPerfectConfetti(true);
      setTimeout(() => setShowPerfectConfetti(false), 5000);
    }

    // Determine levels progression
    let nextLevelToUnlock: number | undefined = undefined;
    if (activeQuizTopicId === 'limits' && pointsGained >= 15) {
      nextLevelToUnlock = 1; // Unlocks Derivatives
    } else if (activeQuizTopicId === 'derivatives' && pointsGained >= 15) {
      nextLevelToUnlock = 2; // Unlocks Integrals
    } else if (activeQuizTopicId === 'integrals' && pointsGained >= 15) {
      nextLevelToUnlock = 3; // Fully master
    }

    try {
      const updated = await AppService.updateStudentProgress(
        currentUser.userId,
        pointsGained,
        nextLevelToUnlock,
        newlyUnlockedBadge
      );

      // Check if total score rose above 90 post-upgrade to hand over "Perfect score/Calculus Genius" badge
      if (updated.score >= 90 && !currentUser.badges.includes('perfect_score')) {
        await AppService.updateStudentProgress(currentUser.userId, 0, undefined, 'perfect_score');
        triggerBadgeUnlockAlert('perfect_score');
      }

      setCurrentUser(prev => prev ? { 
        ...prev, 
        score: updated.score,
        unlockedLevel: updated.unlockedLevel,
        badges: updated.badges
      } : null);

      // Show points toast notification
      setPointsToast({
        amount: pointsGained,
        message: pointsGained >= 0 ? 'XP points successfully credited!' : 'XP points deducted due to errors.'
      });
      setTimeout(() => setPointsToast(null), 4000);

      // If a badge was actually earned, pop up the specialized modal
      if (newlyUnlockedBadge) {
        triggerBadgeUnlockAlert(newlyUnlockedBadge);
      }

    } catch (e) {
      console.error("Failed to update student score", e);
    }
  };

  const triggerBadgeUnlockAlert = (badgeId: string) => {
    const bDef = BADGE_DEFINITIONS.find(b => b.id === badgeId);
    if (bDef) {
      setEarnedBadgeAlert(bDef);
    }
  };

  const getBadgeIconComponent = (iconName: string, css: string) => {
    if (iconName === 'Award') return <Award className={css} />;
    if (iconName === 'Compass') return <Compass className={css} />;
    if (iconName === 'TrendingUp') return <TrendingUp className={css} />;
    if (iconName === 'Layers') return <Layers className={css} />;
    if (iconName === 'Sparkles') return <Sparkles className={css} />;
    return <Award className={css} />;
  };

  // Auth Loading screen
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-white" />
        <p className="text-sm font-medium text-slate-400 font-mono">Loading Academy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-205">
      
      {/* PERFECT SCORE CONFETTI ANIMATION */}
      {showPerfectConfetti && <Confetti />}

      {/* FLOAT ALERT TOAST (POINTS CHANGED) */}
      {pointsToast && (
        <div className="fixed top-5 right-5 z-50 bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in max-w-sm">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${pointsToast.amount >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {pointsToast.amount >= 0 ? `+${pointsToast.amount}` : pointsToast.amount}
          </div>
          <div>
            <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
              XP Updated!
            </div>
            <div className="text-[10px] text-slate-500">{pointsToast.message}</div>
          </div>
        </div>
      )}

      {/* NEW BADGE EARNED POP-UP */}
      {earnedBadgeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full text-center shadow-2xl relative animate-scale-up">
            <button 
              onClick={() => setEarnedBadgeAlert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-605 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center mx-auto mb-4 text-indigo-550 border border-indigo-100 dark:border-indigo-900/30">
              <Sparkles className="w-8 h-8 animate-pulse text-purple-500" />
            </div>

            <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              New Badge Unlocked! 🎖️
            </span>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-3 mb-1">
              {earnedBadgeAlert.titleGe}
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 px-4 mb-6">
              {earnedBadgeAlert.descriptionGe}
            </p>

            <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/30 flex items-center justify-center gap-3">
              {getBadgeIconComponent(earnedBadgeAlert.iconName, "w-8 h-8 text-amber-500")}
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-850 dark:text-slate-150">Academy Order</span>
                <span className="block text-[10px] text-slate-400">Ranking updated on leaderboard</span>
              </div>
            </div>

            <button
              onClick={() => setEarnedBadgeAlert(null)}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs tracking-wider transition-all cursor-pointer"
            >
              Awesome! Continue
            </button>
          </div>
        </div>
      )}

      {/* --- NOT AUTHENTICATED: AUTHENTICATION SCREEN --- */}
      {!currentUser ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-[#F1F5F9] dark:bg-slate-950">
          <div className="w-full max-w-md bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-md">
            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-sm bg-indigo-600 flex items-center justify-center mx-auto mb-3 text-white font-bold text-lg shadow-sm">
                ∫
              </div>
              <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white font-sans uppercase">
                Calculus Academy
              </h2>
              <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-1 uppercase tracking-widest font-semibold">
                The proper way to study higher mathematics
              </p>
            </div>

            {/* Auth tab toggle */}
            <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg mb-6 border border-slate-205/30 dark:border-slate-805/40">
              <button
                onClick={() => { setIsSignUp(false); setAuthError(''); setAuthSuccess(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isSignUp ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsSignUp(true); setAuthError(''); setAuthSuccess(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${isSignUp ? 'bg-white dark:bg-slate-900 shadow-sm text-slate-800 dark:text-white' : 'text-slate-500'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-505 dark:text-slate-400 uppercase mb-1">Student Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g., George Beridze"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-505"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-505 dark:text-slate-400 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="student@academy.com"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-505"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-505 dark:text-slate-400 uppercase mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-505"
                    required
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-955/20 text-rose-700 dark:text-rose-300 text-[11px] rounded-lg flex items-center gap-2 border border-rose-100 animate-pulse-slow">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-955/20 text-emerald-700 dark:text-emerald-300 text-[11px] rounded-lg flex items-center gap-2 border border-emerald-100">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={btnLoading}
                className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-707 transition-all text-white font-semibold rounded-xl text-xs tracking-wide shadow shadow-indigo-150 flex items-center justify-center cursor-pointer"
              >
                {btnLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/50 border-t-white" />
                ) : (
                  <span>{isSignUp ? 'Register Student' : 'Sign In to Platform'}</span>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center gap-2 text-[10px] text-slate-400 leading-normal">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                {isFirebaseEnabled 
                  ? '🔐 Secured with Firebase Cloud Authentication & Firestore Database.'
                  : '💾 Demo Mode: Data is saved locally in your browser storage.'
                }
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* --- AUTHENTICATED MODULE: WORKSPACE SPLIT --- */
        <div className="flex-1 flex flex-col md:flex-row bg-[#F1F5F9] dark:bg-slate-950 min-h-screen">
          {/* DESKTOP SIDEBAR NAVIGATION */}
          <aside className="hidden md:flex md:w-64 md:flex-col shrink-0 bg-slate-900 text-white border-r border-slate-850 p-6 sticky top-0 h-screen select-none justify-between">
            <div>
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-10">
                <div className="w-8 h-8 bg-indigo-500 rounded-sm flex items-center justify-center font-bold text-xl text-white">
                  ∫
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-extrabold tracking-tight uppercase leading-none text-white">
                    Calculus
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-1">
                    Academy
                  </span>
                </div>
              </div>

              {/* Sidebar Navigation Links */}
              <div className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: <span className="font-mono text-center w-5 font-bold text-sm">⊞</span> },
                  { id: 'lessons', label: 'Lessons', icon: <span className="font-mono text-center w-5 font-bold text-sm">f'</span> },
                  { id: 'quiz', label: 'Quiz', icon: <span className="font-mono text-center w-5 font-bold text-sm">?</span> },
                  { id: 'leaderboard', label: 'Leaderboard', icon: <span className="font-mono text-center w-5 font-bold text-sm">🏆</span> },
                  { id: 'sources', label: 'Sources', icon: <span className="font-mono text-center w-5 font-bold text-sm">📚</span> }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setActiveQuizTopicId(null);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all text-left font-semibold text-xs tracking-wide cursor-pointer ${
                        isActive 
                          ? 'bg-indigo-600 text-white shadow shadow-indigo-650/40' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Profile & Logout */}
            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-white font-bold text-xs shrink-0">
                  {currentUser.displayName ? currentUser.displayName.slice(0, 1).toUpperCase() : '👤'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold truncate text-white block leading-tight">{currentUser.displayName}</div>
                  <div className="text-[10px] text-indigo-400 font-bold font-mono mt-0.5">⭐ {currentUser.score} XP</div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* MOBILE NAVIGATION BAR HEADER */}
          <nav className="md:hidden bg-slate-900 text-white border-b border-slate-850 sticky top-0 z-20">
            <div className="px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-500 rounded-sm flex items-center justify-center text-white font-bold text-sm">
                  ∫
                </div>
                <div>
                  <span className="font-bold text-xs tracking-tight text-white block leading-none">
                    Calculus
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-slate-400 block mt-0.5 font-bold">
                    Academy
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
              <div className="px-4 pb-4 space-y-1 bg-slate-900 border-t border-slate-850 py-2 animate-fade-in">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'lessons', label: 'Lessons' },
                  { id: 'quiz', label: 'Quiz' },
                  { id: 'leaderboard', label: 'Leaderboard' },
                  { id: 'sources', label: 'Sources' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setActiveQuizTopicId(null);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                <div className="h-px bg-slate-800 my-2" />
                
                <div className="flex items-center justify-between px-3">
                  <div className="text-left">
                    <div className="text-xs font-bold text-white leading-tight">{currentUser.displayName}</div>
                    <div className="text-[10px] text-indigo-400 font-bold font-mono mt-0.5">⭐ {currentUser.score} XP</div>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="px-2.5 py-1.5 bg-slate-850 hover:bg-rose-950 text-slate-350 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* MAIN CONTAINER CONTENT AND HEADER PANEL */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header section with Stats widgets */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-205 dark:border-slate-800 pb-6 mb-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans tracking-tight">
                    Hello, {currentUser.displayName}! 👋
                  </h1>
                  <p className="text-slate-550 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                    {currentUser.unlockedLevel === 0 && "Today, your goal is to finish the introduction to limits and pass the quiz."}
                    {currentUser.unlockedLevel === 1 && "Today, your goal is to master differential calculus and derivative power rules."}
                    {currentUser.unlockedLevel === 2 && "Today, your goal is to explore integrals and calculate areas under curves."}
                    {currentUser.unlockedLevel >= 3 && "Congratulations! You are a fully certified master of Calculus Academy with a distinguished ranking."}
                  </p>
                </div>
                <div className="flex space-x-3 w-full sm:w-auto shrink-0 select-none">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-205 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center min-w-[100px] flex-1 sm:flex-none">
                    <span className="text-[9px] text-slate-450 dark:text-slate-505 uppercase font-black tracking-wider mb-0.5">Score (XP)</span>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {currentUser.score.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-205 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center min-w-[100px] flex-1 sm:flex-none">
                    <span className="text-[9px] text-slate-450 dark:text-slate-555 uppercase font-black tracking-wider mb-0.5">Active Chapter</span>
                    <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
                      {currentUser.unlockedLevel + 1}
                    </span>
                  </div>
                </div>
              </header>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-12">
              {activeTab === 'dashboard' && (
                <Dashboard
                  currentUser={currentUser}
                  setActiveTab={setActiveTab}
                  setSelectedLesson={setSelectedLesson}
                  setActiveQuizTopicId={setActiveQuizTopicId}
                  leaderboard={leaderboard}
                  loadingLeaderboard={loadingLeaderboard}
                />
              )}

              {activeTab === 'lessons' && (
                <LessonsTab
                  currentUser={currentUser}
                  selectedLesson={selectedLesson}
                  setSelectedLesson={setSelectedLesson}
                  setActiveQuizTopicId={setActiveQuizTopicId}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizTab
                  currentUser={currentUser}
                  activeQuizTopicId={activeQuizTopicId}
                  setActiveQuizTopicId={setActiveQuizTopicId}
                  onQuizComplete={handleQuizCompletion}
                />
              )}

              {activeTab === 'leaderboard' && (
                <LeaderboardTab
                  leaderboard={leaderboard}
                  loadingLeaderboard={loadingLeaderboard}
                  currentUser={currentUser}
                  isFirebaseEnabled={isFirebaseEnabled}
                />
              )}

              {activeTab === 'sources' && (
                <SourcesTab />
              )}
            </main>

            {/* APP FOOTER */}
            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 p-6 text-center text-[10px] text-slate-400">
              <p>© {new Date().getFullYear()} Calculus Academy • Designed in accordance with higher academic standards.</p>
              <p className="mt-1 font-mono">{isFirebaseEnabled ? '💾 Synchronized - Google Cloud Run & Firebase' : '💾 Local Storage Mode - Browser fallback active'}</p>
            </footer>
          </div>
        </div>
      )}

    </div>
  );
}
