import React, { useMemo, useState } from "react";
import {
  ArrowUpTrayIcon,
  DocumentTextIcon,
  PhotoIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";

export type ResourceType = "image" | "document" | "template";

export interface ResourceItem {
  id: string;
  name: string;
  type: ResourceType;
  size: string;
  updatedAt: string;
}

const RESOURCES: ResourceItem[] = [
  {
    id: "r1",
    name: "Brand Logo.png",
    type: "image",
    size: "120 KB",
    updatedAt: "1 hour ago",
  },
  {
    id: "r2",
    name: "AI Workflow Template.md",
    type: "document",
    size: "32 KB",
    updatedAt: "3 hours ago",
  },
  {
    id: "r3",
    name: "Console Layout.fig",
    type: "template",
    size: "2.1 MB",
    updatedAt: "1 day ago",
  },
];

export type ResourceFilter = "all" | "image" | "document" | "template";

interface HeaderBarProps {
  onUploadClick?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ onUploadClick }) => {
  return (
    <header className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-slate-50 md:text-xl">
          Resources
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          一站式管理品牌素材、文档和模板，为你的 AI 工作流提供统一的知识底座。
        </p>
      </div>
      <button
        type="button"
        onClick={onUploadClick}
        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/70 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-100 hover:border-emerald-400 hover:bg-emerald-500/20"
      >
        <ArrowUpTrayIcon className="h-4 w-4" />
        Upload resource
      </button>
    </header>
  );
};

interface ResourceFiltersProps {
  value: ResourceFilter;
  onChange: (value: ResourceFilter) => void;
}

const FILTER_OPTIONS: { value: ResourceFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "image", label: "Images" },
  { value: "document", label: "Documents" },
  { value: "template", label: "Templates" },
];

const ResourceFilters: React.FC<ResourceFiltersProps> = ({ value, onChange }) => {
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

interface ResourceStatsProps {
  resources: ResourceItem[];
}

const ResourceStats: React.FC<ResourceStatsProps> = ({ resources }) => {
  const total = resources.length;
  const imageCount = resources.filter((r) => r.type === "image").length;
  const documentCount = resources.filter((r) => r.type === "document").length;
  const templateCount = resources.filter((r) => r.type === "template").length;

  return (
    <section className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-xs text-slate-300">
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1">
          <PhotoIcon className="h-4 w-4 text-sky-400" />
          <span className="font-medium text-slate-100">{total}</span>
          <span className="text-slate-400">resources tracked</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
          {imageCount} images
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {documentCount} documents
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          {templateCount} templates
        </span>
      </div>
    </section>
  );
};

interface ResourceCardProps {
  resource: ResourceItem;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const typeLabel =
    resource.type === "image" ? "Image" : resource.type === "document" ? "Document" : "Template";

  const typeIcon =
    resource.type === "image"
      ? PhotoIcon
      : resource.type === "document"
      ? DocumentTextIcon
      : RectangleGroupIcon;

  const typeColorClasses =
    resource.type === "image"
      ? "text-sky-300 bg-sky-500/10"
      : resource.type === "document"
      ? "text-emerald-300 bg-emerald-500/10"
      : "text-amber-300 bg-amber-500/10";

  return (
    <button
      type="button"
      className="group flex flex-col items-stretch rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-sky-500/60 hover:shadow-lg hover:shadow-slate-900/60"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-slate-200 group-hover:bg-slate-800">
            <typeIcon className="h-4 w-4" />
          </span>
          <span className="truncate max-w-[180px] sm:max-w-xs">{resource.name}</span>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${typeColorClasses}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {typeLabel}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>{resource.size}</span>
        <span className="text-slate-500 group-hover:text-slate-300">
          Updated {resource.updatedAt}
        </span>
      </div>
    </button>
  );
};

interface ResourceGridProps {
  resources: ResourceItem[];
}

const ResourceGrid: React.FC<ResourceGridProps> = ({ resources }) => {
  if (resources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 px-6 py-10 text-center text-sm text-slate-400">
        <PhotoIcon className="mb-3 h-7 w-7 text-slate-500" />
        <p>No resources match this filter yet.</p>
        <p className="mt-1 text-xs text-slate-500">
          Try switching filters or upload a new resource to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

const Resources: React.FC = () => {
  const [filter, setFilter] = useState<ResourceFilter>("all");

  const filteredResources = useMemo(() => {
    if (filter === "all") return RESOURCES;
    return RESOURCES.filter((r) => r.type === filter);
  }, [filter]);

  return (
    <div className="space-y-4">
      <HeaderBar />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ResourceStats resources={RESOURCES} />
        <ResourceFilters value={filter} onChange={setFilter} />
      </div>
      <ResourceGrid resources={filteredResources} />
    </div>
  );
};

export default Resources;
