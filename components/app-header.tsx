"use client";

import { SidebarMenu } from "./sidebar-menu";

export function AppHeader() {
  return (
    <div className="fixed top-4 left-4 z-50">
      <SidebarMenu />
    </div>
  );
}

