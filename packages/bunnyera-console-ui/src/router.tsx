import React, { createContext, useContext, useState } from "react";

export type RouteId =
  | "dashboard"
  | "projects"
  | "resources"
  | "ai-hub"
  | "log-center"
  | "notes"
  | "settings";

interface RouteContextValue {
  currentRoute: RouteId;
  setRoute: (route: RouteId) => void;
}

const RouteContext = createContext<RouteContextValue | undefined>(undefined);

export const RouteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<RouteId>("dashboard");

  return (
    <RouteContext.Provider value={{ currentRoute, setRoute: setCurrentRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRoute = (): RouteContextValue => {
  const ctx = useContext(RouteContext);
  if (!ctx) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return ctx;
};
