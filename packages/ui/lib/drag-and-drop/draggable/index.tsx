import { useDraggable } from "@dnd-kit/core";
import { cn } from "@workout/ui/utils";
import { GripVertical } from "lucide-react";

type DraggableProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export const Draggable: React.FC<DraggableProps> = ({
  id,
  children,
  className,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex space-x-2", className)}
    >
      <button {...listeners} {...attributes}>
        <GripVertical />
      </button>
      {children}
    </div>
  );
};
