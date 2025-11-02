import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Task } from "./WeeklyTaskTable";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onToggle, onToggleSubtask, onDelete }: TaskCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const priorityColors = {
    low: "bg-muted border-l-4 border-l-muted-foreground",
    medium: "bg-secondary border-l-4 border-l-primary",
    high: "bg-accent/10 border-l-4 border-l-accent",
  };

  const hasSubtasks = task.subtasks.length > 0;
  const completedSubtasks = task.subtasks.filter((st) => st.completed).length;

  return (
    <Card
      className={cn(
        "p-3 transition-all hover:shadow-md",
        priorityColors[task.priority],
        task.completed && "opacity-60"
      )}
    >
      <div className="space-y-2">
        <div className="flex items-start gap-3">
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
                {completedSubtasks}/{task.subtasks.length} subtasks completed
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
  );
};

export default TaskCard;
