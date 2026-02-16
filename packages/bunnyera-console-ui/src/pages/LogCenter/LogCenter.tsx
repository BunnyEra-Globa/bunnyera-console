import React, { useMemo, useState } from "react";
import {
  CpuChipIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export type LogType = "info" | "warning" | "error" | "system";

export interface LogItemData {
  id: string;
  type: LogType;
  message: string;
  timestamp: string;
}

const LOGS: LogItemData[] = [
  {
    id: "l1",
    type: "info",
    message: "UI loaded successfully.",
    timestamp: "2026-02-16 14:32:10",
  },
  {
    id: "l2",
    type: "warning",
    message: "Slow response from AI Hub.",
    timestamp: "2026-02-16 14:35:22",
  },
  {
    id: "l3",
    type: "error",
    message: "Failed to load project metadata.",
    timestamp: "2026-02-16 14:40:01",
  },
  {
    id: "l4",
    type: "system",
    message: "Electron main process started.",
    timestamp: "2026-02-16 14:41:55",
  },
];

export type LogFilter = "all" | LogType;

interface HeaderBarProps {
  onClear?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onClear }) => {
  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
          Log Center
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          集中查看 UI、AI Hub 与系统进程的关键事件日志，第一时间发现异常。
        </p>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-rose-200 hover:border-rose-500/80 hover:bg-rose-500/10"
      >
        <TrashIcon className="h-4 w-4" />
        Clear logs (mock)
      </button>
    </header>
  );
};

interface LogFiltersProps {
  value: LogFilter;
  onChange: (value: LogFilter) => void;
}

const FILTER_OPTIONS: { value: LogFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "error", label: "Error" },
  { value: "system", label: "System" },
];

const LogFilters: React.FC<LogFiltersProps> = ({ value, onChange }) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 p-1 text-xs">
      {FILTER_OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`px-3 py-1 rounded-full transition ${
              isActive
                ? "bg-slate-100 text-slate-900 font-medium"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

interface LogStatsProps {
  logs: LogItemData[];
}

const LogStats: React.FC<LogStatsProps> = ({ logs }) => {
  const total = logs.length;
  const infoCount = logs.filter((l) => l.type === "info").length;
  const warningCount = logs.filter((l) => l.type === "warning").length;
  const errorCount = logs.filter((l) => l.type === "error").length;

  return (
    <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-300">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1">
          <InformationCircleIcon className="h-4 w-4 text-sky-400" />
          <span className="font-medium text-slate-100">{total}</span>
          <span className="text-slate-400">entries</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          {infoCount} info
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          {warningCount} warnings
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          {errorCount} errors
        </span>
      </div>
    </section>
  );
};

interface LogItemProps {
  log: LogItemData;
}

const LogItemRow: React.FC<LogItemProps> = ({ log }) => {
  const icon =
    log.type === "info"
      ? InformationCircleIcon
      : log.type === "warning"
      ? ExclamationTriangleIcon
      : log.type === "error"
      ? XCircleIcon
      : CpuChipIcon;

  const colorClasses =
    log.type === "info"
      ? "text-sky-300 border-sky-500/40 bg-sky-500/5"
      : log.type === "warning"
      ? "text-amber-300 border-amber-500/40 bg-amber-500/5"
      : log.type === "error"
      ? "text-rose-300 border-rose-500/40 bg-rose-500/5"
      : "text-emerald-300 border-emerald-500/40 bg-emerald-500/5";

  const typeLabel =
    log.type === "info"
      ? "Info"
      : log.type === "warning"
      ? "Warning"
      : log.type === "error"
      ? "Error"
      : "System";

  return (
    <li className="group flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-xs text-slate-300 transition hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-900/90">
      <span
        className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg border ${colorClasses}`}
      >
        {React.createElement(icon, { className: "h-4 w-4" })}
      </span>
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-slate-100">{log.message}</span>
          <span className="text-[11px] text-slate-500">{log.timestamp}</span>
        </div>
        <div className="mt-1 inline-flex items-center gap-2 text-[11px] text-slate-500">
          <span
            className={`inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] ${colorClasses}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {typeLabel}
          </span>
          {log.type === "system" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-emerald-300">
              <CpuChipIcon className="h-3.5 w-3.5" />
              Console runtime
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

interface LogListProps {
  logs: LogItemData[];
}

const LogList: React.FC<LogListProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-6 py-10 text-center text-sm text-slate-400">
        <InformationCircleIcon className="mb-3 h-7 w-7 text-slate-500" />
        <p>No logs in this view.</p>
        <p className="mt-1 text-xs text-slate-500">
          Once the console starts receiving events again, they will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {logs.map((log) => (
        <LogItemRow key={log.id} log={log} />
      ))}
    </ul>
  );
};

const LogCenter: React.FC = () => {
  const [filter, setFilter] = useState<LogFilter>("all");
  const [logs, setLogs] = useState<LogItemData[]>(LOGS);

  const filteredLogs = useMemo(() => {
    if (filter === "all") return logs;
    return logs.filter((l) => l.type === filter);
  }, [logs, filter]);

  const handleClear = () => {
    // mock 清空，仅清空前端状态
    setLogs([]);
  };

  return (
    <div className="space-y-4">
      <HeaderBar onClear={handleClear} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <LogStats logs={logs} />
        <LogFilters value={filter} onChange={setFilter} />
      </div>
      <LogList logs={filteredLogs} />
    </div>
  );
};

export default LogCenter;
