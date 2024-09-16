import { cn } from "@workout/ui/utils";

type SessionLayoutProps = {
  children: React.ReactNode;
};

const SessionLayout: React.FC<SessionLayoutProps> = ({ children }) => (
  <div className="h-screen">
    <div
      className={cn(
        "flex min-h-full flex-1 flex-col justify-center",
        "px-6 sm:px-0"
      )}
    >
      {children}
    </div>
  </div>
);

export default SessionLayout;
