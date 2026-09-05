import React from 'react';
import { CheckSquare, Square, Clock, User, Link2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { GPActionItem } from '../../types/clinical';

interface GpActionTabProps {
  actions: GPActionItem[];
  onToggleAction: (actionId: string) => void;
  onCitationClick: (citationId: string) => void;
  showCitations: boolean;
}

export const GpActionTab: React.FC<GpActionTabProps> = ({
  actions,
  onToggleAction,
  onCitationClick,
  showCitations,
}) => {
  const urgencyGroups = [
    { key: 'immediate_24h', title: 'Immediate Actions (Within 24–48 Hours)', color: 'border-red-200/80 bg-red-50/70 text-red-800' },
    { key: 'urgent_7d', title: 'Urgent Actions (Within 7 Days)', color: 'border-amber-200/80 bg-amber-50/70 text-amber-800' },
    { key: 'routine_4w', title: 'Routine Primary Care Follow-up (2–4 Weeks)', color: 'border-blue-200/80 bg-blue-50/70 text-blue-800' },
    { key: 'safety_net', title: 'Safety Netting & Carer Instructions', color: 'border-emerald-200/80 bg-emerald-50/70 text-emerald-800' },
  ];

  const completedCount = actions.filter((a) => a.completed).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#f0f4f9] border border-blue-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100/80 flex items-center justify-center text-blue-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-800 block">
              Actionable Primary Care Handover Checklist
            </span>
            <span className="text-[11px] text-slate-500">
              Categorized responsibilities, safety netting, and lab re-test schedules
            </span>
          </div>
        </div>
        <div className="text-xs font-medium text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
          {completedCount} of {actions.length} Completed
        </div>
      </div>

      {/* Urgency Group Sections */}
      {urgencyGroups.map((group) => {
        const groupActions = actions.filter((a) => a.urgency === group.key);
        if (groupActions.length === 0) return null;

        return (
          <div key={group.key} className="space-y-3">
            <div className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center justify-between ${group.color}`}>
              <span>{group.title}</span>
              <span className="text-[11px] font-medium">{groupActions.length} item(s)</span>
            </div>

            <div className="space-y-3">
              {groupActions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleAction(item.id)}
                  className={`flex items-start justify-between p-5 rounded-2xl border bg-white shadow-2xs transition-all cursor-pointer hover:border-slate-300 hover:shadow-xs ${item.completed ? 'opacity-65 bg-[#f8fafd]' : 'border-slate-200/80'
                    }`}
                >
                  <div className="flex items-start space-x-3.5 flex-1">
                    <button
                      type="button"
                      className="mt-0.5 text-blue-600 hover:text-blue-800 focus:outline-none flex-shrink-0"
                    >
                      {item.completed ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400" />
                      )}
                    </button>

                    <div>
                      <h4
                        className={`text-sm font-semibold text-slate-900 leading-snug ${item.completed ? 'line-through text-slate-400' : ''
                          }`}
                      >
                        {item.action}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {item.rationale}
                      </p>

                      <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-2.5 border-t border-slate-100 text-xs">
                        <span className="inline-flex items-center space-x-1.5 text-slate-500 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>Timeline: <b className="font-semibold text-slate-700">{item.timeline}</b></span>
                        </span>
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200/50">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>Assignee: {item.assignedRole}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {showCitations && item.sourceCitationId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCitationClick(item.sourceCitationId!);
                      }}
                      className="ml-4 px-2.5 py-1 text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100/70 rounded-lg border border-blue-200/60 text-xs font-medium flex items-center space-x-1 flex-shrink-0 transition-colors"
                      title="View rationale in timeline notes"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline px-1">Source</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
