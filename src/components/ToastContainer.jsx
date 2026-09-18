import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 transition-all transform animate-bounce-short ${
              isSuccess
                ? 'bg-[#101623]/95 border-emerald-500/40 text-emerald-300'
                : isWarning
                ? 'bg-[#101623]/95 border-rose-500/40 text-rose-300'
                : 'bg-[#101623]/95 border-amber-500/40 text-amber-300'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {isWarning && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
            {!isSuccess && !isWarning && <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}

            <div className="flex-1 text-xs">
              <h5 className="font-bold text-white leading-snug">{toast.title}</h5>
              <p className="text-gray-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
