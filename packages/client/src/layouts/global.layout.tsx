"use client";

import { cn } from "@workout/ui";
import React from "react";
import Navbar from "~/components/navbar";

type GlobalLayoutProps = {
  children: React.ReactNode;
};

const GlobalLayout: React.FC<GlobalLayoutProps> = ({
  children,
}: GlobalLayoutProps) => {
  return (
    <div className="flex w-full h-screen max-h-screen min-h-screen">
      <div className={cn("w-full h-full flex flex-col")}>
        <Navbar />

        <div className="flex flex-col h-[calc(100%-4rem)] max-h-[calc(100%-4rem)] p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default GlobalLayout;
