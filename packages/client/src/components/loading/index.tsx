import { cn } from "@workout/ui";
import LoadingSvgComponent from "~/icons/loading";

type LoadingProps = {
  className?: string;
};

const Loading: React.FC<LoadingProps> = (props: LoadingProps) => {
  return (
    <div
      className={cn(
        "h-screen flex items-center justify-center",
        props.className
      )}
    >
      <div>
        <LoadingSvgComponent height={128} width={128} />
      </div>
    </div>
  );
};

export default Loading;
