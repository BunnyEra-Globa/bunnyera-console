import React from "react";
import {
  SparklesIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  CommandLineIcon,
  BeakerIcon,
  ClockIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  UserGroupIcon,
  BookOpenIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";

interface AgentProfile {
  id: string;
  name: string;
  role: string;
  status: "idle" | "running" | "paused";
  focus: string[];
}

interface PromptItem {
  id: string;
  title: string;
  category: string;
  usageHint: string;
}

interface TaskChainItem {
  id: string;
  name: string;
  steps: number;
  estimatedTime: string;
  category: string;
}

interface ActivityItem {
  id: string;
  type: "session" | "prompt" | "chain";
  title: string;
  timeAgo: string;
  summary: string;
}

interface UsageMetric {
  id: string;
  label: string;
  value: string;
  hint: string;
}

const AGENTS: AgentProfile[] = [
  {
    id: "a1",
    name: "Research Agent",
    role: "长文调研与对比分析",
    status: "idle",
    focus: ["Market", "Tech stack", "Competition"],
  },
  {
    id: "a2",
    name: "Ops Agent",
    role: "脚本生成与运维自动化",
    status: "running",
    focus: ["CLI", "Infra", "Playbooks"],
  },
  {
    id: "a3",
    name: "Content Agent",
    role: "文案、邮件与更新日志",
    status: "paused",
    focus: ["Changelog", "Emails", "Docs"],
  },
];

const PROMPTS: PromptItem[] = [
  {
    id: "p1",
    title: "Generate weekly changelog",
    category: "Product",
    usageHint: "输入本周的 commits 或 notes",
  },
  {
    id: "p2",
    title: "Explain stack trace like I\"m five",
    category: "Debugging",
    usageHint: "粘贴错误信息 + 运行环境",
  },
  {
    id: "p3",
    title: "Rewrite feature announcement",
    category: "Communication",
    usageHint: "输入原始 announcement 草稿",
  },
  {
    id: "p4",
    title: "Design onboarding sequence for solo SaaS",
    category: "Growth",
    usageHint: "提供产品定位 + 目标用户",
  },
];

const TASK_CHAINS: TaskChainItem[] = [
  {
    id: "c1",
    name: "Error → RCA → Fix plan",
    steps: 4,
    estimatedTime: "8-12 min",
    category: "Ops",
  },
  {
    id: "c2",
    name: "Idea → Spec → Ticket",
    steps: 5,
    estimatedTime: "12-18 min",
    category: "Product",
  },
  {
    id: "c3",
    name: "Release notes → Email → Tweet",
    steps: 3,
    estimatedTime: "6-10 min",
    category: "Comms",
  },
];

const ACTIVITIES: ActivityItem[] = [
  {
    id: "ac1",
    type: "session",
    title: "Ops Agent debugged staging timeout",
    timeAgo: "12 min ago",
    summary: "生成了 nginx 配置 diff 与 rollback plan。",
  },
  {
    id: "ac2",
    type: "prompt",
    title: "Prompt: Generate weekly changelog",
    timeAgo: "34 min ago",
    summary: "总结本周 14 个 commits 为 4 个要点。",
  },
  {
    id: "ac3",
    type: "chain",
    title: "Chain: Release notes → Email",
    timeAgo: "2 hrs ago",
    summary: "草拟了一封 280 字的升级提醒邮件。",
  },
];

const USAGE: UsageMetric[] = [
  {
    id: "u1",
    label: "Tokens today",
    value: "38.2k",
    hint: "+12.4% vs last week",
  },
  {
    id: "u2",
    label: "Active agents",
    value: "2 / 5",
    hint: "Research, Ops currently active",
  },
  {
    id: "u3",
    label: "Avg session length",
    value: "7m 42s",
    hint: "P95 under 12m",
  },
];

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950 px-6 py-6 md:px-8 md:py-7">
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
            <SparklesIcon className="h-3.5 w-3.5" />
            AI Hub · Multi-Agent Workspace
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
            把你的一个人公司，配上一个 AI 团队
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-400">
            为常见工作流（调研、运维、文案）配置专属 Agent 与 Prompt 库，
            让重复的脑力劳动在这里自动化完成。
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
              <UserGroupIcon className="h-4 w-4 text-sky-400" />
              3 preset agents
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
              <BookOpenIcon className="h-4 w-4 text-emerald-400" />
              Prompt library wired to console
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1">
              <LinkIcon className="h-4 w-4 text-amber-300" />
              Task chains for recurring workflows
            </span>
          </div>
        </div>
        <div className="hidden shrink-0 md:flex md:flex-col md:items-end md:justify-between md:gap-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="text-slate-400">Current focus</div>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-200">
                Solo builder
              </span>
            </div>
            <div className="mt-2 text-sm font-medium text-slate-50">
              Ship faster, think less manually
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Start a chain or fire a prompt, and let agents coordinate.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full border border-sky-500/60 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-100 hover:border-sky-400 hover:bg-sky-500/20">
            <BoltIcon className="h-4 w-4" />
            Start new AI session
          </button>
        </div>
      </div>
      <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-sky-500/20 blur-3xl" />
    </section>
  );
};

const AgentsPanel: React.FC = () => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Multi-agent workspace</h2>
          <p className="mt-1 text-xs text-slate-500">
            为不同类型的任务绑定不同 Agent，保持上下文独立又可复用。
          </p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:border-slate-500 hover:bg-slate-900/70">
          <UserGroupIcon className="h-3.5 w-3.5" />
          Manage agents
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {AGENTS.map((agent) => {
          const statusLabel =
            agent.status === "running"
              ? "Running"
              : agent.status === "paused"
              ? "Paused"
              : "Idle";
          const statusColor =
            agent.status === "running"
              ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
              : agent.status === "paused"
              ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
              : "bg-slate-800 text-slate-300 border-slate-700";

          return (
            <button
              key={agent.id}
              className="group flex flex-col items-stretch rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-3 text-left hover:border-sky-500/60 hover:bg-slate-900"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-100">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-sky-400" />
                  {agent.name}
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${statusColor}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {statusLabel}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{agent.role}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {agent.focus.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400 group-hover:bg-slate-800 group-hover:text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-sky-300">
                <CommandLineIcon className="h-3.5 w-3.5" />
                Open session
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

const PromptLibrary: React.FC = () => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Prompt library</h2>
          <p className="mt-1 text-xs text-slate-500">
            把你已经验证好用的 Prompt 固定下来，一键复用。
          </p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:border-slate-500 hover:bg-slate-900/70">
          <BookOpenIcon className="h-3.5 w-3.5" />
          New prompt
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {PROMPTS.map((prompt) => (
          <button
            key={prompt.id}
            className="group flex w-full items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-left hover:border-emerald-500/60 hover:bg-slate-900"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-100">
                <SparklesIcon className="h-4 w-4 text-emerald-400" />
                {prompt.title}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                {prompt.usageHint}
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
                <BeakerIcon className="h-3.5 w-3.5" />
                {prompt.category}
              </div>
            </div>
            <ArrowRightIcon className="mt-1 h-4 w-4 text-slate-600 group-hover:text-emerald-300" />
          </button>
        ))}
      </div>
    </section>
  );
};

const TaskChains: React.FC = () => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Task chains</h2>
          <p className="mt-1 text-xs text-slate-500">
            为高频流程配置多步 Chain，一次输入，多步输出。
          </p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:border-slate-500 hover:bg-slate-900/70">
          <AdjustmentsHorizontalIcon className="h-3.5 w-3.5" />
          Configure chains
        </button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {TASK_CHAINS.map((chain) => (
          <button
            key={chain.id}
            className="group flex w-full items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-left hover:border-sky-500/60 hover:bg-slate-900"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-100">
                <BoltIcon className="h-4 w-4 text-sky-400" />
                {chain.name}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                {chain.steps} steps · {chain.estimatedTime}
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] text-slate-400">
                <ClockIcon className="h-3.5 w-3.5" />
                {chain.category}
              </div>
            </div>
            <ArrowRightIcon className="mt-1 h-4 w-4 text-slate-600 group-hover:text-sky-300" />
          </button>
        ))}
      </div>
    </section>
  );
};

const ActivityFeed: React.FC = () => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">Recent AI activity</h2>
        <span className="text-xs text-slate-500">Last 3 hours</span>
      </div>
      <ul className="mt-4 space-y-2">
        {ACTIVITIES.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-xs"
          >
            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-slate-200">
              {item.type === "session" && (
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-sky-400" />
              )}
              {item.type === "prompt" && (
                <SparklesIcon className="h-4 w-4 text-emerald-400" />
              )}
              {item.type === "chain" && <BoltIcon className="h-4 w-4 text-amber-300" />}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium text-slate-100">{item.title}</div>
                <span className="text-[11px] text-slate-500">{item.timeAgo}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500">{item.summary}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const UsageSummary: React.FC = () => {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Usage & guardrails</h2>
          <p className="mt-1 text-xs text-slate-500">
            关注花掉多少 token，更重要的是你节省了多少脑力时间。
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {USAGE.map((metric) => (
          <div
            key={metric.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-3 text-xs"
          >
            <div className="text-slate-400">{metric.label}</div>
            <div className="mt-1 text-sm font-semibold text-slate-50">
              {metric.value}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">{metric.hint}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-500">
        <BeakerIcon className="h-3.5 w-3.5 text-sky-300" />
        <span>
          在真正上生产前，先在这里跑一遍 dry-run，确认输出风格、敏感信息和安全边界。
        </span>
      </div>
    </section>
  );
};

const AIHub: React.FC = () => {
  return (
    <div className="space-y-5">
      <Hero />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)]">
        <AgentsPanel />
        <UsageSummary />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1.3fr)]">
        <div className="space-y-4">
          <PromptLibrary />
          <TaskChains />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
};

export default AIHub;
