import React, { useMemo, useState } from "react";
import { FolderIcon, PlusIcon, FunnelIcon } from "@heroicons/react/24/outline";

export type ProjectStatus = "active" | "archived";

export interface ProjectItem {
  id: string;
  name: string;
  updatedAt: string;
  status: ProjectStatus;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "p1",
    name: "BunnyEra AI Agents",
    updatedAt: "2 hours ago",
    status: "active",
  },
  {
    id: "p2",
    name: "Console UI Layout",
    updatedAt: "1 day ago",
    status: "active",
  },
  {
    id: "p3",
    name: "Resource Manager",
    updatedAt: "3 days ago",
    status: "archived",
  },
];

export type ProjectFilter = "all" | ProjectStatus;

interface HeaderBarProps {
  onCreateClick?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onCreateClick }) => {
  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
          Projects
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          管理你的一人公司里所有重要的项目空间，保持上下文清晰、有节奏地推进。
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-500 hover:bg-slate-800">
          <FunnelIcon className="h-4 w-4" />
          View archive
        </button>
        <button
          type="button"
          onClick={onCreateClick}
          className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/70 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-100 hover:border-sky-400 hover:bg-sky-500/20"
        >
          <PlusIcon className="h-4 w-4" />
          New project
        </button>
      </div>
    </header>
  );
};

interface FiltersProps {
  value: ProjectFilter;
  onChange: (value: ProjectFilter) => void;
}

const FILTERS: { value: ProjectFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
];

const Filters: React.FC<FiltersProps> = ({ value, onChange }) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 p-1 text-xs">
      {FILTERS.map((filter) => {
        const isActive = value === filter.value;
        return (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={`px-3 py-1 rounded-full transition ${
              isActive
                ? "bg-slate-100 text-slate-900 font-medium"
                : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};

interface StatsBarProps {
  projects: ProjectItem[];
}

const StatsBar: React.FC<StatsBarProps> = ({ projects }) => {
  const total = projects.length;
  const activeCount = projects.filter((p) => p.status === "active").length;
  const archivedCount = projects.filter((p) => p.status === "archived").length;
  const latest = projects[0]?.updatedAt ?? "-";

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-300">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1">
          <FolderIcon className="h-4 w-4 text-sky-400" />
          <span className="font-medium text-slate-100">{total}</span>
          <span className="text-slate-400">projects in console</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          {activeCount} active
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          {archivedCount} archived
        </span>
      </div>
      <div className="text-[11px] text-slate-500">
        Last updated project activity: <span className="text-slate-300">{latest}</span>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: ProjectItem;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const isActive = project.status === "active";
  const statusColor = isActive ? "text-sky-300 bg-sky-500/10" : "text-slate-300 bg-slate-700/20";

  return (
    <button
      type="button"
      className="group flex flex-col items-stretch rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-500/60 hover:shadow-lg hover:shadow-slate-900/60"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sky-300 group-hover:bg-slate-800">
            <FolderIcon className="h-4 w-4" />
          </span>
          <span className="truncate">{project.name}</span>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${statusColor}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {project.status === "active" ? "Active" : "Archived"}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>Updated {project.updatedAt}</span>
        <span className="hidden sm:inline text-slate-500 group-hover:text-slate-300">
          Open workspace →
        </span>
      </div>
    </button>
  );
};

interface ProjectListProps {
  projects: ProjectItem[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-6 py-10 text-center text-sm text-slate-400">
        <FolderIcon className="mb-3 h-7 w-7 text-slate-500" />
        <p>No projects match this filter yet.</p>
        <p className="mt-1 text-xs text-slate-500">
          Try switching filters or create a new project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

const Projects: React.FC = () => {
  const [filter, setFilter] = useState<ProjectFilter>("all");

  const filteredProjects = useMemo(() => {
    if (filter === "all") return PROJECTS;
    return PROJECTS.filter((p) => p.status === filter);
  }, [filter]);

  return (
    <div className="space-y-4">
      <HeaderBar />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StatsBar projects={PROJECTS} />
        <Filters value={filter} onChange={setFilter} />
      </div>
      <ProjectList projects={filteredProjects} />
    </div>
  );
};

export default Projects;
