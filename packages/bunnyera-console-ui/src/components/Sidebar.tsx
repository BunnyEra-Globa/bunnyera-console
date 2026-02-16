import React from "react";
import { FolderIcon, ListBulletIcon, PhotoIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useRoute, type RouteId } from "../router";

interface NavItem {
  id: RouteId;
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "projects", label: "Projects", icon: FolderIcon },
  { id: "resources", label: "Resources", icon: PhotoIcon },
  { id: "ai-hub", label: "AI Hub", icon: SparklesIcon },
  { id: "log-center", label: "Log Center", icon: ListBulletIcon },
  { id: "notes", label: "Notes" },
  { id: "settings", label: "Settings" },
];

export const Sidebar: React.FC = () => {
  const { currentRoute, setRoute } = useRoute();

  return (
    <aside className="w-60 border-r border-slate-800 bg-slate-950/80 px-4 py-4 flex flex-col">
      <div className="mb-6">
        <div className="text-xs font-semibold text-slate-500">BUNNYERA</div>
        <div className="text-sm text-slate-300">Console v2.0</div>
      </div>
      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setRoute(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? "bg-slate-800/90 text-white font-medium"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                {item.icon && <item.icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </span>
            </button>
          );
        })}
      </nav>
      <div className="mt-4 text-xs text-slate-500">
        © {new Date().getFullYear()} BunnyEra
      </div>
    </aside>
  );
};
