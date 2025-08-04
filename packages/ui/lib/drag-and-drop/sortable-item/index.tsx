import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@workout/ui/utils";
import { GripVertical } from "lucide-react";

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
  title?: string;
  className?: string;
  iconSize?: string | number;
};

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  title,
  children,
  className,
  iconSize = 24,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("flex space-x-2", className)}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-secondary/50 transition-colors"
        {...listeners}
        {...attributes}
      >
        <div className="flex gap-x-2 items-center">
          <GripVertical size={iconSize} />
          {title}
        </div>
      </button>
      {children}
    </div>
  );
};
