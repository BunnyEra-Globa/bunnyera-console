import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-950/70 backdrop-blur">
      <div className="text-sm text-slate-300">
        Welcome back, <span className="font-semibold">BunnyEra</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span>Workspace: Solo Enterprise</span>
        <span className="h-1 w-1 rounded-full bg-emerald-400 inline-block mx-1" />
        <span>Console Online</span>
      </div>
    </header>
  );
};
