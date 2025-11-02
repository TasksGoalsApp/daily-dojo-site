import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Task } from "./WeeklyTaskTable";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
}

const TaskCard = ({ task, onToggle, onToggleSubtask, onDelete, isDragging = false }: TaskCardProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const { attributes, listeners, setNodeRef: setDraggableRef, transform } = useDraggable({
    id: task.id,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `${task.day}-${task.hour}`,
  });

  const priorityColors = {
    low: "bg-muted border-l-4 border-l-muted-foreground",
    medium: "bg-secondary border-l-4 border-l-primary",
    high: "bg-accent/10 border-l-4 border-l-accent",
  };

  const hasSubtasks = task.subtasks.length > 0;
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setDroppableRef} className="h-full">
      <Card
        ref={setDraggableRef}
        style={style}
        className={cn(
          "p-2 transition-all hover:shadow-md h-full cursor-move",
          priorityColors[task.priority],
          task.completed && "opacity-60",
          isDragging && "opacity-50 cursor-grabbing"
        )}
      >
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div
              {...listeners}
              {...attributes}
              className="cursor-grab active:cursor-grabbing mt-0.5"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm font-medium break-words",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </p>
              {hasSubtasks && (
                <p className="text-xs text-muted-foreground mt-1">
                  {completedSubtasks}/{task.subtasks.length} subtasks
                </p>
              )}
            </div>
            <div className="flex gap-1">
              {hasSubtasks && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {expanded && hasSubtasks && (
            <div className="ml-9 space-y-2 pt-2 border-t border-border/50">
              {task.subtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => onToggleSubtask(task.id, subtask.id)}
                    className="h-3 w-3"
                  />
                  <p
                    className={cn(
                      "text-xs break-words flex-1",
                      subtask.completed && "line-through text-muted-foreground"
                    )}
                  >
                    {subtask.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TaskCard;
