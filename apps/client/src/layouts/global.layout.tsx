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
      <div className="relative mt-16 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
        {children}
      </div>
    </div>
  );
};

export default GlobalLayout;
