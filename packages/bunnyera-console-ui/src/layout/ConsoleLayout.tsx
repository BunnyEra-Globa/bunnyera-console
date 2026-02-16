import React from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import Dashboard from "../pages/Dashboard/Dashboard";
import AIHub from "../pages/AIHub/AIHub";
import Projects from "../pages/Projects/Projects";
import Resources from "../pages/Resources/Resources";
import LogCenter from "../pages/LogCenter/LogCenter";
import { useRoute } from "../router";

const MainContent: React.FC = () => {
  const { currentRoute } = useRoute();

  if (currentRoute === "dashboard") {
    return <Dashboard />;
  }

  if (currentRoute === "ai-hub") {
    return <AIHub />;
  }

  if (currentRoute === "projects") {
    return <Projects />;
  }

  if (currentRoute === "resources") {
    return <Resources />;
  }

  if (currentRoute === "log-center") {
    return <LogCenter />;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-400">
      <div className="text-sm font-semibold text-slate-100">
        {currentRoute[0].toUpperCase() + currentRoute.slice(1)}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        This section is not wired yet. Dashboard is available as the default
        landing page.
      </p>
    </div>
  );
};

export const ConsoleLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 border-t border-slate-800">
          <MainContent />
        </main>
      </div>
    </div>
  );
};
