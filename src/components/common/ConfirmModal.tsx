import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icons } from './Icons';

export const ConfirmModal: React.FC = () => {
  const { confirmDialog, closeConfirm } = useApp();

  if (!confirmDialog) return null;

  return (
    <div
      onClick={closeConfirm}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl bg-[#141B2C] border border-[#232D48] p-5 shadow-2xl animate-scale-up"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-base text-[#F3F5F9]">
            {confirmDialog.title || 'Are you sure?'}
          </h3>
          <button
            onClick={closeConfirm}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A93AC] hover:text-[#F3F5F9] hover:bg-[#1C2540] transition-colors"
          >
            <Icons.Close size={18} />
          </button>
        </div>

        <p className="text-sm text-[#8A93AC] leading-relaxed mb-5">
          {confirmDialog.message}
        </p>

        <div className="flex items-center gap-2.5">
          <button
            onClick={closeConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#232D48] bg-[#1C2540] hover:bg-[#212B4A] text-[#8A93AC] hover:text-[#F3F5F9] font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              confirmDialog.onConfirm();
              closeConfirm();
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-white font-semibold text-xs shadow-md transition-all active:scale-95 ${
              confirmDialog.danger
                ? 'bg-[#FF5D6C] hover:bg-[#FF4557] shadow-[#FF5D6C]/25'
                : 'bg-gradient-to-r from-[#3E8EFF] to-[#7C5CFF] hover:opacity-95 shadow-[#3E8EFF]/25'
            }`}
          >
            {confirmDialog.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
