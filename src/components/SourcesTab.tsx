import React from 'react';
import { BookOpen, ExternalLink, CheckCircle, ChevronRight } from 'lucide-react';
import { REFERENCE_SOURCES } from '../data';

export function SourcesTab() {
  return (
    <div className="space-y-6 animate-fade-in select-none">
      <div className="text-center max-w-md mx-auto mb-6">
        <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-sans uppercase tracking-tight">
          Academic References & Sources
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          For the purposes of copyright compliance and academic integrity, the official materials used in the creation of this platform are listed below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REFERENCE_SOURCES.map((source, idx) => (
          <a
            key={idx}
            href={source.link}
            target="_blank"
            referrerPolicy="no-referrer"
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl hover:border-indigo-400 dark:hover:border-indigo-650 transition-all shadow-sm flex flex-col justify-between"
            id={`academic-source-card-${idx}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                  source.category === 'Books' ? 'bg-indigo-50 text-indigo-750 dark:bg-indigo-950/40 dark:text-indigo-300' :
                  source.category === 'Websites' ? 'bg-emerald-50 text-emerald-750 dark:bg-emerald-950/40 dark:text-emerald-300' :
                  'bg-orange-50 text-orange-750 dark:bg-orange-950/40 dark:text-orange-300'
                }`}>
                  {source.category}
                </span>

                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </div>

              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                {source.title}
              </h4>
              <span className="block text-[10px] text-slate-400 mt-1 font-mono">Author: {source.author}</span>

              <p className="text-xs text-slate-505 dark:text-slate-400 mt-3 leading-relaxed">
                {source.descriptionGe}
              </p>
            </div>

            <div className="mt-5 text-[10px] text-indigo-500 group-hover:underline font-bold flex items-center gap-0.5">
              <span>Go to Source</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </a>
        ))}
      </div>

      <div className="p-6 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
          <h4 className="text-sm font-bold text-white">Educational Value of the Platform</h4>
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          This web application is designed as an open educational resource for students preparing for calculus exams (limits, derivatives, integrals). The selection of reference materials was carried out in accordance with higher mathematics educational standards.
        </p>
      </div>
    </div>
  );
}
