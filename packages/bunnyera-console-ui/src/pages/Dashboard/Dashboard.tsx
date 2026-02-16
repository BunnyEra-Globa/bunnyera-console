import React from "react";
import {
  ArrowRightIcon,
  PlusIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CpuChipIcon,
  BoltIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

// Mock 数据类型
interface Task {
  id: string;
  title: string;
  project?: string;
  dueTime: string;
  status: "pending" | "in-progress" | "done";
}

interface Project {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  updatedAt: string;
}

interface SystemMetric {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "stable";
  description: string;
}

interface AIShortcut {
  id: string;
  label: string;
  description: string;
  hint: string;
}

// Mock 数据
const todayTasks: Task[] = [
  {
    id: "t1",
    title: "Review overnight error logs",
    project: "BunnyEra Console Core",
    dueTime: "09:30",
    status: "in-progress",
  },
  {
    id: "t2",
    title: "Sync resources with production CDN",
    project: "Static Assets",
    dueTime: "11:00",
    status: "pending",
  },
  {
    id: "t3",
    title: "Draft weekly changelog for v2.0",
    project: "Console UI",
    dueTime: "16:00",
    status: "pending",
  },
];

const recentProjects: Project[] = [
  {
    id: "p1",
    name: "BunnyEra Console v2.0",
    status: "active",
    updatedAt: "5 min ago",
  },
  {
    id: "p2",
    name: "AI Hub Prompt Library",
    status: "active",
    updatedAt: "32 min ago",
  },
  {
    id: "p3",
    name: "One-Person Enterprise Kit",
    status: "paused",
    updatedAt: "2 hrs ago",
  },
];

const systemMetrics: SystemMetric[] = [
  {
    id: "m1",
    label: "Error rate (24h)",
    value: "0.08%",
    trend: "down",
    description: "Compared to yesterday -0.02%",
  },
  {
    id: "m2",
    label: "Job queue latency",
    value: "186 ms",
    trend: "stable",
    description: "P95 across all workers",
  },
  {
    id: "m3",
    label: "AI tokens today",
    value: "38.2k",
    trend: "up",
    description: "+12.4% vs last week",
  },
];

const aiShortcuts: AIShortcut[] = [
  {
    id: "a1",
    label: "Draft release note",
    description: "Summarize latest changes into a human-readable changelog.",
    hint: "Changelog · Product Copy",
  },
  {
    id: "a2",
    label: "Debug console error",
    description: "Paste a stack trace and get a step-by-step fix plan.",
    hint: "Debugging · Triage",
  },
  {
    id: "a3",
    label: "Generate onboarding email",
    description: "Create a friendly onboarding email for new customers.",
    hint: "Growth · Communication",
  },
  {
    id: "a4",
    label: "Refine system prompt",
    description: "Iterate on a system prompt for your internal assistant.",
    hint: "AI Ops · Prompting",
  },
];

// Hero 区
const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950 px-6 py-6 md:px-8 md:py-7">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Console v2.0 · Solo Enterprise
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            早上好，BunnyEra
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            一站式控制台，帮你在一个页面里收拢项目、资源、日志和 AI 能力。
            今天，只需要照着这里的节奏走完关键三件事。
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
              <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
              Deploy pipeline healthy
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
              <CpuChipIcon className="h-4 w-4 text-sky-400" />
              AI Hub ready
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
              <BoltIcon className="h-4 w-4 text-amber-300" />
              3 tasks queued for today
            </span>
          </div>
        </div>
        <div className="hidden shrink-0 md:flex md:flex-col md:items-end md:justify-between md:gap-3">
          <div className="rounded-xl border border-emerald-500/20 bg-slate-900/60 px-4 py-3 text-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="text-slate-400">Today focus window</div>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                Deep work
              </span>
            </div>
            <div className="mt-2 text-sm font-medium text-slate-50">09:00 - 12:00</div>
            <p className="mt-1 text-[11px] text-slate-400">
              Keep the console open, and let the system surface what matters.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800/80 hover:text-white">
            <PlayCircleIcon className="h-4 w-4" />
            Start focus session
          </button>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-6 -top-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl md:-right-10 md:-top-16" />
    </section>
  );
};

// QuickActions 区
const QuickActions: React.FC = () => {
  const actions = [
    {
      id: "qa1",
      label: "New project",
      description: "Spin up a new workspace for a one-person product.",
      icon: PlusIcon,
    },
    {
      id: "qa2",
      label: "Upload resource",
      description: "Attach docs, assets or knowledge to your console.",
      icon: DocumentTextIcon,
    },
    {
      id: "qa3",
      label: "Open AI Hub",
      description: "Jump into your personal AI toolbox.",
      icon: SparklesIcon,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Quick actions</h2>
          <p className="mt-1 text-xs text-slate-500">
            常用入口在这里，一步到位，不陷入菜单迷宫。
          </p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:border-slate-500 hover:bg-slate-900/70">
          View all
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            className="group flex w-full items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-left hover:border-slate-600 hover:bg-slate-900"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900/80 text-slate-200 group-hover:bg-slate-800">
              <action.icon className="h-4 w-4" />
            </span>
            <span className="flex-1">
              <div className="text-xs font-medium text-slate-100">
                {action.label}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                {action.description}
              </div>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

// TodayTasks 区
const TodayTasks: React.FC = () => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">Today</h2>
        <span className="text-xs text-slate-500">
          {todayTasks.length} items · lightweight planning
        </span>
      </div>
      <ol className="mt-4 space-y-2">
        {todayTasks.map((task) => {
          const statusLabel =
            task.status === "done"
              ? "Done"
              : task.status === "in-progress"
              ? "In progress"
              : "Pending";
          const statusColor =
            task.status === "done"
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              : task.status === "in-progress"
              ? "bg-sky-500/15 text-sky-300 border-sky-500/30"
              : "bg-slate-800 text-slate-300 border-slate-700";

          return (
            <li
              key={task.id}
              className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5"
            >
              <button className="mt-0.5 h-4 w-4 rounded-full border border-slate-600/80 bg-slate-950" />
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-100">
                    {task.title}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${statusColor}`}
                  >
                    {task.status === "done" ? (
                      <CheckCircleIcon className="h-3 w-3" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    )}
                    {statusLabel}
                  </span>
                </div>
                {task.project && (
                  <div className="mt-1 text-[11px] text-slate-400">
                    {task.project}
                  </div>
                )}
                <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px]">
                    Due {task.dueTime}
                  </span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

// RecentProjects 区
const RecentProjects: React.FC = () => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">Recent projects</h2>
        <button className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200">
          View all
          <ArrowRightIcon className="h-3.5 w-3.5" />
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        {recentProjects.map((project) => {
          const badgeColor =
            project.status === "completed"
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              : project.status === "paused"
              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
              : "bg-sky-500/15 text-sky-300 border-sky-500/30";

          return (
            <li
              key={project.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5 text-xs"
            >
              <div>
                <div className="font-medium text-slate-100">
                  {project.name}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  Updated {project.updatedAt}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${badgeColor}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {project.status}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

// SystemStatus 区
const SystemStatus: React.FC = () => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">System status</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
          <CheckCircleIcon className="h-3 w-3" />
          All systems nominal
        </span>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {systemMetrics.map((metric) => (
          <div
            key={metric.id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-xs"
          >
            <div>
              <div className="text-slate-300">{metric.label}</div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                {metric.description}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-50">
                {metric.value}
              </div>
              <div className="mt-0.5 flex items-center justify-end gap-1 text-[11px] text-slate-500">
                {metric.trend === "up" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
                {metric.trend === "down" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                )}
                {metric.trend === "stable" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                )}
                <span className="capitalize">{metric.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-500">
        <ExclamationTriangleIcon className="h-3.5 w-3.5 text-amber-300" />
        <span>
          Synthetic checks are running every 60s. You&apos;ll see alerts here before users notice.
        </span>
      </div>
    </section>
  );
};

// AIShortcuts 区
const AIShortcuts: React.FC = () => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">AI Hub shortcuts</h2>
          <p className="mt-1 text-xs text-slate-500">
            用几秒钟时间，把重复性的脑力工作交给 AI。
          </p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:border-slate-500 hover:bg-slate-900/70">
          <SparklesIcon className="h-3.5 w-3.5" />
          Open AI Hub
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2">
        {aiShortcuts.map((item) => (
          <button
            key={item.id}
            className="group flex w-full items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-left hover:border-slate-600 hover:bg-slate-900"
          >
            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/80 text-slate-200 group-hover:bg-slate-800">
              {item.id === "a1" && <DocumentTextIcon className="h-4 w-4" />}
              {item.id === "a2" && <ExclamationTriangleIcon className="h-4 w-4" />}
              {item.id === "a3" && <ChatBubbleLeftRightIcon className="h-4 w-4" />}
              {item.id === "a4" && <LightBulbIcon className="h-4 w-4" />}
            </span>
            <span className="flex-1">
              <div className="text-xs font-medium text-slate-100">
                {item.label}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                {item.description}
              </div>
              <div className="mt-1 text-[10px] text-slate-500">{item.hint}</div>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

// Dashboard 页面总布局
const Dashboard: React.FC = () => {
  return (
    <div className="space-y-5">
      {/* 顶部：Hero + QuickActions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)]">
        <Hero />
        <QuickActions />
      </div>

      {/* 下方主区域：左侧 TodayTasks + RecentProjects，右侧 SystemStatus + AIShortcuts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
        <div className="space-y-4">
          <TodayTasks />
          <RecentProjects />
        </div>
        <div className="space-y-4">
          <SystemStatus />
          <AIShortcuts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
