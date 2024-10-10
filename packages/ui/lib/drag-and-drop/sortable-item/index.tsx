import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@workout/ui/utils";
import { GripVertical } from "lucide-react";

type SortableItemProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  children,
  className,
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
      <button {...listeners} {...attributes}>
        <GripVertical />
      </button>
      {children}
    </div>
  );
};
