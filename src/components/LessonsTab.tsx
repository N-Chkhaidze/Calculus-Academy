import React, { useState } from 'react';
import { Lock, ChevronRight, Sparkles, Play, ExternalLink, Trophy } from 'lucide-react';
import { LessonTopic } from '../types';
import { LESSON_TOPICS } from '../data';
import { MathVisualizer } from './MathVisualizer';

interface LessonsTabProps {
  currentUser: any;
  selectedLesson: LessonTopic;
  setSelectedLesson: (topic: LessonTopic) => void;
  setActiveQuizTopicId: (topicId: string | null) => void;
  setActiveTab: (tab: 'dashboard' | 'lessons' | 'quiz' | 'leaderboard' | 'sources') => void;
}

export function LessonsTab({
  currentUser,
  selectedLesson,
  setSelectedLesson,
  setActiveQuizTopicId,
  setActiveTab,
}: LessonsTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'theory' | 'problems' | 'media'>('theory');

  const isTopicUnlocked = (index: number) => {
    return currentUser.unlockedLevel >= index;
  };

  const getTopicIconComponent = (iconName: string, css: string) => {
    if (iconName === 'Percent') return <span className="font-mono font-bold">lim</span>;
    if (iconName === 'TrendingUp') return <span className="font-sans font-bold">f'</span>;
    return <span className="font-mono font-bold">∫</span>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in select-none">
      {/* Left side list menu selection */}
      <div className="lg:col-span-4 space-y-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-4">
          Calculus Courses
        </span>

        {LESSON_TOPICS.map((topic) => {
          const unlocked = isTopicUnlocked(topic.index);
          const isSelected = selectedLesson.id === topic.id;

          return (
            <button
              key={topic.id}
              onClick={() => {
                if (unlocked) {
                  setSelectedLesson(topic);
                }
              }}
              disabled={!unlocked}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-805 dark:text-indigo-305 shadow-sm'
                  : unlocked
                  ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-955/50'
                  : 'border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-955/45 opacity-40 cursor-not-allowed text-slate-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-sm border flex items-center justify-center shrink-0 text-xs ${topic.colorClass}`}>
                  {getTopicIconComponent(topic.icon, "w-4 h-4")}
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Chapter {topic.index + 1}</span>
                  <span className="block text-xs font-bold leading-snug mt-1">{topic.titleGe}</span>
                </div>
              </div>

              <div>
                {!unlocked ? (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                ) : isSelected ? (
                  <div className="w-2 h-2 rounded-full bg-indigo-500" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-450" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Right side educational content render */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm">
          {/* Header info */}
          <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5 mb-5">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
              Calculus Academy • Chapter {selectedLesson.index + 1}
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1 text-slate-900 dark:text-white font-sans" id="lesson-detail-title">
              {selectedLesson.titleGe}
            </h2>
            <p className="text-xs italic text-slate-440 font-serif mt-0.5 mb-2">
              {selectedLesson.titleEn} — {selectedLesson.taglineEn}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {selectedLesson.descriptionGe}
            </p>
          </div>

          {/* Interactive sub-tab switcher */}
          <div className="flex border-b border-slate-150 dark:border-slate-800/80 mb-6 font-sans gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveSubTab('theory')}
              className={`pb-3 text-xs font-bold px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'theory'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
              }`}
            >
              📖 Theoretical Content
            </button>
            <button
              onClick={() => setActiveSubTab('problems')}
              className={`pb-3 text-xs font-bold px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'problems'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
              }`}
            >
              ✏️ Step-by-Step Problem Solving
            </button>
            <button
              onClick={() => setActiveSubTab('media')}
              className={`pb-3 text-xs font-bold px-3 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === 'media'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
              }`}
            >
              📺 Videos & Media Materials
            </button>
          </div>

          {/* SUB-TAB: THEORY & LESSONS */}
          {activeSubTab === 'theory' && (
            <div className="space-y-6">
              {/* Interactive math visualizer block layout */}
              <div className="bg-slate-50/55 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-850 dark:text-slate-200 mb-3 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Interactive Mathematics Visualizer</span>
                </div>
                <MathVisualizer topicId={selectedLesson.id as any} />
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed space-y-4 text-slate-650 dark:text-slate-350" id="lesson-academic-content">
                {selectedLesson.id === 'limits' && (
                  <>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-l-4 border-rose-500 pl-2">
                      1. What is a Limit?
                    </h4>
                    <p>
                      The limit is the foundational cornerstone of calculus. It precisely answers the question: <span className="font-semibold text-rose-500">"What happens to f(x) as the argument x gets infinitely close to a specific value?"</span>.
                    </p>
                    <p>
                      In mathematics, it is common to encounter functions that cannot be computed directly at a certain point. For example:
                    </p>
                    <div className="p-3 rounded-xl font-mono bg-slate-50 dark:bg-slate-950/60 border border-slate-200/40 text-center my-3">
                      <span className="text-xs font-bold text-rose-500">f(x) = (x² - 1) / (x - 1)</span>
                    </div>
                    <p>
                      If we plug in <span className="font-mono">x = 1</span> directly, we get <span className="font-semibold text-rose-600">0/0</span> which is an indeterminate form, resulting in a mathematical error due to division by zero. However, if we evaluate values extremely close to <span className="font-mono">1</span> (e.g., <span className="font-mono">1.0001</span> or <span className="font-mono font-bold">0.9999</span>), we observe that <span className="font-mono">f(x)</span> approaches <span className="font-semibold text-rose-500 text-xs font-mono">2</span>!
                    </p>

                    <div className="p-4 rounded-xl font-mono bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100/40 text-center my-3">
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">lim (x → c) f(x) = L</span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-l-4 border-rose-500 pl-2 mt-5">
                      2. One-Sided Limits and the Condition of Existence
                    </h4>
                    <p>
                      For a limit to exist generally, the function must approach the same value from both the left (<span className="font-semibold text-rose-505 dark:text-rose-405">x → c⁻</span>) and the right (<span className="font-semibold text-indigo-505 dark:text-indigo-405">x → c⁺</span>):
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Left-Hand Limit:</strong> Approaching from the left, using values smaller than c.</li>
                      <li><strong>Right-Hand Limit:</strong> Approaching from the right, using values larger than c.</li>
                    </ul>
                    <p className="bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 p-2.5 rounded-lg border border-amber-200/50">
                      <strong>💡 Fundamental Gold Rule:</strong> A limit exists and equals <span className="font-mono font-bold">L</span> if and only if both the left-hand and right-hand limits are equal at that point!
                    </p>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-l-4 border-rose-500 pl-2 mt-5">
                      3. Squeeze Theorem (Sandwich Theorem)
                    </h4>
                    <p>
                      Also known as the "Sandwich Theorem". If we have three functions satisfying <span className="font-semibold">g(x) ≤ f(x) ≤ h(x)</span> near a point, and the limits of <span className="font-mono">g(x)</span> and <span className="font-mono">h(x)</span> as <span className="font-mono">x → c</span> are both equal to <span className="font-semibold text-rose-500">L</span>, then the middle function <span className="font-mono">f(x)</span> is forced to approach <span className="font-semibold text-rose-400">L</span> as well!
                    </p>
                  </>
                )}

                {selectedLesson.id === 'derivatives' && (
                  <>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-l-4 border-indigo-505 pl-2">
                      1. What is a Derivative?
                    </h4>
                    <p>
                      The derivative represents the <span className="font-extrabold text-indigo-500">instantaneous rate of change</span> of a function. While average rate of change measures slope over an interval, the derivative measures the slope as the interval size shrinks to zero!
                    </p>

                    <div className="p-4 rounded-xl font-mono bg-slate-50 dark:bg-slate-950/60 border border-slate-200/40 text-center my-3">
                      <span className="text-xs sm:text-xs font-bold text-indigo-500">f&apos;(x) = lim (h → 0) [f(x + h) - f(x)] / h</span>
                    </div>

                    <p>
                      Geometrically, if we take a curve and draw a line through two points on it (a secant line), as we bring these two points infinitely close, the line becomes a single <strong>tangent line</strong>. The slope of this tangent line is precisely the derivative!
                    </p>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-l-4 border-indigo-505 pl-2 mt-5">
                      2. Fundamental Rules of Differentiation (Cheat Sheet)
                    </h4>
                    <p>
                      Differentiation is a linear operation. Explore the key rules below:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono my-3 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="block text-indigo-500 font-bold">Power Rule</span>
                        (xⁿ)&apos; = n • xⁿ⁻¹
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="block text-emerald-500 font-bold">Product Rule</span>
                        (u • v)&apos; = u&apos; • v + u • v&apos;
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="block text-rose-500 font-bold">Quotient Rule</span>
                        (u/v)&apos; = (u&apos; • v - u • v&apos;) / v²
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="block text-amber-500 font-bold">Chain Rule</span>
                        [f(g(x))]&apos; = f&apos;(g(x)) • g&apos;(x)
                      </div>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-l-4 border-indigo-505 pl-2 mt-5">
                      3. Physical and Practical Significance
                    </h4>
                    <p>
                      In the physical world, if you have a position function of an object with respect to time <span className="font-mono">S(t)</span>, its first derivative is the instantaneous velocity <span className="font-mono font-bold">v(t) = S&apos;(t)</span>. The derivative of velocity is the acceleration <span className="font-mono font-bold">a(t) = v&apos;(t) = S&apos;&apos;(t)</span>!
                    </p>
                  </>
                )}

                {selectedLesson.id === 'integrals' && (
                  <>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-l-4 border-emerald-505 pl-2">
                      1. What is an Integral?
                    </h4>
                    <p>
                      Integration is the direct inverse operation of differentiation, which is why it is often called the <strong>antiderivative</strong>. While the derivative reveals the slope of a curve, the integral measures the <strong>total accumulated area</strong> under that curve.
                    </p>

                    <div className="p-4 rounded-xl font-mono bg-slate-50 dark:bg-slate-950/60 border border-slate-200/40 text-center my-3">
                      <span className="text-xs sm:text-xs font-bold text-emerald-500">∫ f(x) dx = F(x) + C</span>
                    </div>

                    <p>
                      Here, <span className="font-mono">C</span> is the constant of integration. Why do we add it? Because the derivative of any constant (e.g., 7) is 0. Thus, when we reverse the process, we cannot know the original constant without additional conditions!
                    </p>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-l-4 border-emerald-505 pl-2 mt-5">
                      2. Fundamental Theorem of Calculus (Newton-Leibniz)
                    </h4>
                    <p>
                      This theorem is one of the greatest achievements in mathematics, linking differentiation and integration into a single framework. It is formulated as:
                    </p>
                    <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl font-mono text-center my-3 text-emerald-800 dark:text-emerald-300">
                      ∫ (from a to b) f(x) dx = F(b) - F(a)
                    </div>
                    <p>
                      This means that to compute the area under any complex curve, we do not need to manually construct infinite rectangles; it is sufficient to find its antiderivative <span className="font-mono">F(x)</span> and evaluate the difference between the upper and lower bounds!
                    </p>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white border-l-4 border-emerald-505 pl-2 mt-5">
                      3. Calculus in Science and Technology
                    </h4>
                    <p>
                      Integrals are widely used in physics to calculate work, in statistics to define probability density functions, and in machine learning neural networks to optimize loss functions via continuous models.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB: STEP BY STEP PROBLEMS */}
          {activeSubTab === 'problems' && (
            <div className="space-y-6">
              <span className="text-[10px] block font-bold text-amber-500 uppercase tracking-widest">
                Step-by-Step Practical Problem Analysis & Explanations
              </span>

              {selectedLesson.id === 'limits' && (
                <div className="space-y-6">
                  {/* Problem 1 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-955/50 border border-slate-150 dark:border-slate-800/60">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 mb-2 uppercase">Problem #1</span>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 mb-2">
                      Evaluate the 0/0 indeterminate form: <span className="font-mono text-rose-500 font-bold">lim (x → 2) (x² - 4) / (x - 2)</span>
                    </h4>
                    <div className="space-y-3 pl-3 border-l-2 border-rose-300 dark:border-rose-900 mt-3 text-xs text-slate-650 dark:text-slate-400">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 1: Check.</strong> Plug in <span className="font-mono">x = 2</span>. We get <span className="font-mono">(2² - 4) / (2 - 2) = 0/0</span>. This is a classic indeterminate form.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 2: Factor the numerator.</strong> The numerator <span className="font-mono">x² - 4</span> is a difference of squares, which factors into: <span className="font-mono text-rose-550 font-bold">(x - 2)(x + 2)</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 3: Simplify.</strong> The equation simplifies to:
                        <div className="my-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 font-mono text-center">
                          lim (x → 2) [ (x - 2)(x + 2) ] / (x - 2) = lim (x → 2) (x + 2)
                        </div>
                        (x-2) cancels out. Since x approaches 2 but is not exactly equal to 2, division by zero does not occur!
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 4: Find the limit.</strong> Now we can directly evaluate:
                        <span className="font-mono block mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">2 + 2 = 4</span>
                      </div>
                    </div>
                  </div>

                  {/* Problem 2 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-955/50 border border-slate-150 dark:border-slate-800/60">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-955/40 dark:text-rose-300 mb-2 uppercase">Problem #2</span>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 mb-2">
                      Limit at infinity: <span className="font-mono text-rose-500 font-bold">lim (x → ∞) (3x² + 5x) / (2x² - 1)</span>
                    </h4>
                    <div className="space-y-3 pl-3 border-l-2 border-rose-300 dark:border-rose-900 mt-3 text-xs text-slate-650 dark:text-slate-400">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 1: Leading term analysis.</strong> As x approaches infinity, the behavior of the fraction is primarily determined by the highest-degree terms (x²).
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 2: Divide by x².</strong> Divide both numerator and denominator by the highest power <span className="font-mono font-bold">x²</span>:
                        <div className="my-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 font-mono text-center">
                          [ (3x²/x²) + (5x/x²) ] / [ (2x²/x²) - (1/x²) ] = [ 3 + 5/x ] / [ 2 - 1/x² ]
                        </div>
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 3: Evaluate the limit.</strong> As x approaches infinity, any constant divided by x approaches zero (<span className="font-mono">5/x → 0</span> and <span className="font-mono">1/x² → 0</span>):
                        <span className="font-mono block mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">[ 3 + 0 ] / [ 2 - 0 ] = 3/2 = 1.5</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedLesson.id === 'derivatives' && (
                <div className="space-y-6">
                  {/* Problem 1 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-955/50 border border-slate-150 dark:border-slate-800/60">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 mb-2 uppercase">Problem #1</span>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 mb-2">
                      Find the derivative: <span className="font-mono text-indigo-550 font-bold">f(x) = 4x³ - 5x² + 7x - 9</span>
                    </h4>
                    <div className="space-y-3 pl-3 border-l-2 border-indigo-300 dark:border-indigo-900 mt-3 text-xs text-slate-650 dark:text-slate-400">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 1: Apply the Power Rule.</strong> The formula is <span className="font-mono">(xⁿ)&apos; = n • xⁿ⁻¹</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 2: Differentiate the first term.</strong> <span className="font-mono">(4x³)&apos; = 4 • 3x² = 12x²</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 3: Differentiate the second term.</strong> <span className="font-mono">(-5x²)&apos; = -5 • 2x = -10x</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 4: Differentiate linear and constant terms.</strong> <span className="font-mono">(7x)&apos; = 7</span>, while the derivative of a constant is zero: <span className="font-mono">(-9)&apos; = 0</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Answer:</strong>
                        <span className="font-mono block mt-1 text-xs font-bold text-indigo-650 dark:text-indigo-400">f&apos;(x) = 12x² - 10x + 7</span>
                      </div>
                    </div>
                  </div>

                  {/* Problem 2 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-955/50 border border-slate-150 dark:border-slate-800/60">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 mb-2 uppercase">Problem #2</span>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 mb-2">
                      Differentiate using the Chain Rule: <span className="font-mono text-indigo-550 font-bold">f(x) = (2x² + 5)³</span>
                    </h4>
                    <div className="space-y-3 pl-3 border-l-2 border-indigo-300 dark:border-indigo-900 mt-3 text-xs text-slate-650 dark:text-slate-400">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 1: Identify outer and inner functions.</strong>
                        The outer function is <span className="font-mono">u³</span>, where the inner function is <span className="font-mono">u = 2x² + 5</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 2: Differentiate the outer function.</strong>
                        The derivative is <span className="font-mono">3u² = 3(2x² + 5)²</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 3: Multiply by the derivative of the inner function.</strong>
                        <span className="font-mono">u&apos; = (2x² + 5)&apos; = 4x</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 4: Combine the results.</strong>
                        Following the Chain Rule:
                        <div className="my-2 p-2 bg-white dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800 font-mono text-center">
                          f&apos;(x) = 3(2x² + 5)² • 4x = 12x(2x² + 5)²
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedLesson.id === 'integrals' && (
                <div className="space-y-6">
                  {/* Problem 1 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-955/50 border border-slate-150 dark:border-slate-800/60">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 mb-2 uppercase">Problem #1</span>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 mb-2">
                      Evaluate the definite integral: <span className="font-mono text-emerald-550 font-bold">∫ (0 to 2) (3x² + 4x) dx</span>
                    </h4>
                    <div className="space-y-3 pl-3 border-l-2 border-emerald-300 dark:border-emerald-900 mt-3 text-xs text-slate-650 dark:text-slate-400">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 1: Find the antiderivative F(x).</strong>
                        Using the power rule for integration:
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>∫ 3x² dx = 3 • (x³ / 3) = <span className="font-mono">x³</span></li>
                          <li>∫ 4x dx = 4 • (x² / 2) = <span className="font-mono">2x²</span></li>
                        </ul>
                        Therefore, <span className="font-mono font-bold text-emerald-600">F(x) = x³ + 2x²</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 2: Apply the Newton-Leibniz formula.</strong>
                        We need to evaluate <span className="font-mono">F(2) - F(0)</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 3: Substitute the bounds.</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li><span className="font-mono">F(2) = 2³ + 2(2²) = 8 + 8 = 16</span></li>
                          <li><span className="font-mono">F(0) = 0³ + 2(0²) = 0</span></li>
                        </ul>
                        The final area is <span className="font-mono font-bold text-emerald-600">16 - 0 = 16</span>.
                      </div>
                    </div>
                  </div>

                  {/* Problem 2 */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-955/50 border border-slate-150 dark:border-slate-800/60">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 mb-2 uppercase">Problem #2</span>
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100 mb-2">
                      Evaluate the indefinite integral: <span className="font-mono text-emerald-550 font-bold">∫ (6x⁵ - 1/x²) dx</span>
                    </h4>
                    <div className="space-y-3 pl-3 border-l-2 border-emerald-300 dark:border-emerald-900 mt-3 text-xs text-slate-650 dark:text-slate-400">
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 1: Rewrite the terms.</strong>
                        Rewrite <span className="font-mono">1/x²</span> as <span className="font-mono">x⁻²</span>: <span className="font-mono">∫ (6x⁵ - x⁻²) dx</span>.
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 2: Integrate term by term.</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>∫ 6x⁵ dx = 6 • (x⁶ / 6) = <span className="font-mono">x⁶</span></li>
                          <li>∫ -x⁻² dx = - [ x⁻¹ / -1 ] = + x⁻¹ = <span className="font-mono">1/x</span></li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">Step 3: Add the constant of integration.</strong>
                        The final answer is: <span className="font-mono font-bold text-emerald-650 dark:text-emerald-400">x⁶ + 1/x + C</span>.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB: MEDIA & VIDEOS */}
          {activeSubTab === 'media' && (
            <div className="space-y-6">
              <span className="text-[10px] block font-bold text-indigo-500 uppercase tracking-widest">
                Video Lectures & Educational Animations for Deep Conceptual Understanding
              </span>

              {/* Custom SVG CSS Educational Animation */}
              <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-150 dark:border-slate-800/60 overflow-hidden">
                <span className="text-[10px] block font-bold text-emerald-500 uppercase tracking-widest mb-3">
                  Visual Graphical Loop Animation
                </span>
                
                {selectedLesson.id === 'limits' && (
                  <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="relative w-full md:w-1/2 h-36 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                      {/* Animated Limit Diagram */}
                      <svg width="200" height="120" className="overflow-visible">
                        <line x1="10" y1="100" x2="190" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                        <line x1="30" y1="10" x2="30" y2="110" stroke="#94a3b8" strokeWidth="1.5" />
                        {/* Curve */}
                        <path d="M 30,100 Q 100,80 170,20" fill="none" stroke="#64748b" strokeWidth="2" />
                        {/* Empty hole represent void */}
                        <circle cx="120" cy="55" r="5" fill="white" stroke="#f43f5e" strokeWidth="3" />
                        
                        {/* Dynamic approaches */}
                        <circle cx="80" cy="74" r="4" fill="#3b82f6" className="animate-pulse">
                          <animate attributeName="cx" values="60;110;60" dur="4s" repeatCount="indefinite" />
                          <animate attributeName="cy" values="84;59;84" dur="4s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="150" cy="35" r="4" fill="#3b82f6" className="animate-pulse">
                          <animate attributeName="cx" values="160;130;160" dur="4s" repeatCount="indefinite" />
                          <animate attributeName="cy" values="27;48;27" dur="4s" repeatCount="indefinite" />
                        </circle>
                      </svg>
                    </div>
                    <div className="w-full md:w-1/2 text-xs text-slate-500 dark:text-slate-400">
                      <strong>Visualization:</strong> Points approach the "hole" (the undefined point) from both sides. Although the function is undefined at the hole itself, the limit still exists and equals the height approached by the points.
                    </div>
                  </div>
                )}

                {selectedLesson.id === 'derivatives' && (
                  <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="relative w-full md:w-1/2 h-36 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                      {/* Animated Derivative Secant to Tangent */}
                      <svg width="200" height="120" className="overflow-visible">
                        <line x1="10" y1="100" x2="190" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                        {/* Curve */}
                        <path d="M 20,90 Q 100,80 180,30" fill="none" stroke="#64748b" strokeWidth="2" />
                        {/* Stationary central point */}
                        <circle cx="100" cy="65" r="4.5" fill="#4f46e5" />
                        {/* Animated tangent slope line */}
                        <line x1="40" y1="100" x2="160" y2="30" stroke="#c084fc" strokeWidth="2">
                          <animate attributeName="y1" values="80;95;80" dur="3.5s" repeatCount="indefinite" />
                          <animate attributeName="y2" values="50;35;50" dur="3.5s" repeatCount="indefinite" />
                        </line>
                      </svg>
                    </div>
                    <div className="w-full md:w-1/2 text-xs text-slate-500 dark:text-slate-400">
                      <strong>Visualization:</strong> The animation displays the secant line converging to the tangent line. As the interval (dx) shrinks to zero, the slope becomes instantaneous — which is precisely the derivative!
                    </div>
                  </div>
                )}

                {selectedLesson.id === 'integrals' && (
                  <div className="flex flex-col md:flex-row items-center gap-5">
                    <div className="relative w-full md:w-1/2 h-36 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden">
                      {/* Animated Riemann Slices */}
                      <svg width="200" height="120" className="overflow-visible">
                        <line x1="10" y1="100" x2="190" y2="100" stroke="#94a3b8" strokeWidth="1.5" />
                        <path d="M 30,90 Q 100,50 170,40" fill="none" stroke="#64748b" strokeWidth="2" />
                        {/* Animated columns appearing */}
                        <g fill="#10b981" fillOpacity="0.25" stroke="#059669" strokeWidth="1">
                          <rect x="40" y="80" width="30" height="20" />
                          <rect x="70" y="65" width="30" height="35" />
                          <rect x="100" y="55" width="30" height="45" />
                          <rect x="130" y="47" width="30" height="53" />
                        </g>
                      </svg>
                    </div>
                    <div className="w-full md:w-1/2 text-xs text-slate-500 dark:text-slate-400">
                      <strong>Visualization:</strong> Rectangles are constructed under the curve. According to the Riemann sum, as the slices become narrower, they approximate the exact area under the curve with increasing precision!
                    </div>
                  </div>
                )}
              </div>

              {/* Video Embed Card with Aspect-Ratio */}
              <div className="space-y-4">
                <span className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  📌 Video Lesson: 3Blue1Brown Essence of Calculus
                </span>
                
                {selectedLesson.id === 'limits' && (
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-850 bg-black">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/kfF40MiS7zA"
                        title="limits lecture video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50/60 dark:bg-red-950/20 p-3.5 rounded-xl border border-red-100/50 dark:border-red-950/40">
                      <div className="text-[11px] text-red-850 dark:text-red-300 leading-relaxed">
                        <span className="font-extrabold block">📺 Video not playing?</span>
                        Due to browser security/cookie settings, the embedded YouTube player may be blocked.
                      </div>
                      <a
                        href="https://www.youtube.com/watch?v=kfF40MiS7zA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-red-150 dark:shadow-none whitespace-nowrap cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedLesson.id === 'derivatives' && (
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-850 bg-black">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/9vKqVkJXQRE"
                        title="derivatives lecture video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50/60 dark:bg-red-950/20 p-3.5 rounded-xl border border-red-100/50 dark:border-red-950/40">
                      <div className="text-[11px] text-red-850 dark:text-red-300 leading-relaxed">
                        <span className="font-extrabold block">📺 Video not playing?</span>
                        Due to browser security/cookie settings, the embedded YouTube player may be blocked.
                      </div>
                      <a
                        href="https://www.youtube.com/watch?v=9vKqVkJXQRE"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-red-150 dark:shadow-none whitespace-nowrap cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedLesson.id === 'integrals' && (
                  <div className="space-y-3">
                    <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-850 bg-black">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/RfY4sV_I6vA"
                        title="integrals lecture video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50/60 dark:bg-red-950/20 p-3.5 rounded-xl border border-red-100/50 dark:border-red-950/40">
                      <div className="text-[11px] text-red-850 dark:text-red-300 leading-relaxed">
                        <span className="font-extrabold block">📺 Video not playing?</span>
                        Due to browser security/cookie settings, the embedded YouTube player may be blocked.
                      </div>
                      <a
                        href="https://www.youtube.com/watch?v=RfY4sV_I6vA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-red-150 dark:shadow-none whitespace-nowrap cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-slate-400 mt-2 text-center font-sans">
                  *Videos are shared for educational purposes from the 3Blue1Brown "Essence of Calculus" series.
                </p>
              </div>
            </div>
          )}

          {/* Trigger prompt to take the quiz */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">Have you mastered the lesson?</span>
              <span className="block text-[10px] text-slate-400">Pass the corresponding quiz and earn up to +30 XP!</span>
            </div>

            <button
              onClick={() => {
                setActiveQuizTopicId(selectedLesson.id);
                setActiveTab('quiz');
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-indigo-150 dark:shadow-none shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Start Quiz</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
