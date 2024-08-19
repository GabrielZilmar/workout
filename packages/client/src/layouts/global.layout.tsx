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
    <div className="flex flex-col w-full">
      <Navbar />
      <div className="relative mt-10 p-6 overflow-y-auto">{children}</div>
    </div>
  );
};

export default GlobalLayout;
