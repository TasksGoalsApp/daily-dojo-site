import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import TaskCard from "./TaskCard";
import AddTaskDialog from "./AddTaskDialog";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  day: string;
  hour: number;
  priority: "low" | "medium" | "high";
  completed: boolean;
  subtasks: Subtask[];
  isWeekly?: boolean;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const SHORT_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8);

const formatHour = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:00 ${period}`;
};

const formatHourShort = (hour: number) => {
  const period = hour >= 12 ? "p" : "a";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}${period}`;
};

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Team Meeting",
    day: "Monday",
    hour: 9,
    priority: "high",
    completed: false,
    subtasks: [
      { id: "1-1", title: "Prepare presentation", completed: true },
      { id: "1-2", title: "Review agenda", completed: false },
    ],
  },
  {
    id: "2",
    title: "Project Documentation",
    day: "Tuesday",
    hour: 14,
    priority: "medium",
    completed: false,
    subtasks: [
      { id: "2-1", title: "Write README", completed: false },
      { id: "2-2", title: "Update API docs", completed: false },
    ],
  },
  {
    id: "3",
    title: "Code Review",
    day: "Wednesday",
    hour: 10,
    priority: "high",
    completed: true,
    subtasks: [],
  },
  {
    id: "4",
    title: "Workout Session",
    day: "Thursday",
    hour: 18,
    priority: "low",
    completed: false,
    subtasks: [
      { id: "4-1", title: "Cardio 30min", completed: false },
      { id: "4-2", title: "Strength training", completed: false },
    ],
  },
];

const WeeklyTaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<number>(9);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Simple week navigation (visual only for now)
  const [weekOffset, setWeekOffset] = useState(0);
  const getWeekLabel = () => {
    const now = new Date();
    now.setDate(now.getDate() + weekOffset * 7);
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `${fmt(monday)} – ${fmt(sunday)}`;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getTaskForCell = (day: string, hour: number) => {
    return tasks.find((task) => task.hour === hour && (task.day === day || task.isWeekly));
  };

  const handleAddTask = (day: string, hour: number) => {
    setSelectedDay(day);
    setSelectedHour(hour);
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleCreateTask = (newTask: Omit<Task, "id">) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...newTask, id: task.id } : task)));
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now().toString() }]);
    }
  };

  const handleEditTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsDialogOpen(true);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, completed: !st.completed } : st
              ),
            }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === event.active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;
    const taskId = active.id as string;
    const [day, hourStr] = (over.id as string).split("-");
    const hour = parseInt(hourStr);
    const existingTask = getTaskForCell(day, hour);
    if (existingTask && existingTask.id !== taskId) return;
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, day, hour, isWeekly: false } : task)));
  };

  const todayName = DAYS[((new Date().getDay() + 6) % 7)];

  return (
    <div className="space-y-4">
      {/* Week Navigation Bar */}
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-3 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => setWeekOffset(weekOffset - 1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{getWeekLabel()}</p>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="text-xs text-primary hover:underline"
            >
              Back to this week
            </button>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={() => setWeekOffset(weekOffset + 1)}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <div className="min-w-[900px]">
            {/* Header Row */}
            <div className="grid grid-cols-[72px_repeat(7,1fr)] border-b border-border bg-muted/50">
              <div className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-center">
                Time
              </div>
              {DAYS.map((day, i) => {
                const isToday = day === todayName && weekOffset === 0;
                return (
                  <div
                    key={day}
                    className={cn(
                      "p-3 text-center border-l border-border",
                      isToday && "bg-primary/5"
                    )}
                  >
                    <p className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      isToday ? "text-primary" : "text-muted-foreground"
                    )}>
                      {SHORT_DAYS[i]}
                    </p>
                    {isToday && (
                      <div className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            {HOURS.map((hour, hourIdx) => (
              <div
                key={hour}
                className={cn(
                  "grid grid-cols-[72px_repeat(7,1fr)]",
                  hourIdx < HOURS.length - 1 && "border-b border-border/50"
                )}
              >
                {/* Hour Label */}
                <div className="p-2 flex items-start justify-center pt-3 border-r border-border/50">
                  <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                    {formatHourShort(hour)}
                  </span>
                </div>

                {/* Day Cells */}
                {DAYS.map((day) => {
                  const task = getTaskForCell(day, hour);
                  const cellId = `${day}-${hour}`;
                  const isToday = day === todayName && weekOffset === 0;

                  return (
                    <TimeCell
                      key={cellId}
                      id={cellId}
                      task={task}
                      isToday={isToday}
                      onAddTask={() => handleAddTask(day, hour)}
                      onToggle={handleToggleTask}
                      onToggleSubtask={handleToggleSubtask}
                      onDelete={handleDeleteTask}
                      onEdit={handleEditTask}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="opacity-80">
              <TaskCard
                task={activeTask}
                onToggle={() => {}}
                onToggleSubtask={() => {}}
                onDelete={() => {}}
                onEdit={() => {}}
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddTaskDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTask(null);
        }}
        onCreateTask={handleCreateTask}
        selectedDay={selectedDay}
        selectedHour={selectedHour}
        editingTask={editingTask}
      />
    </div>
  );
};

// Time Cell Component
interface TimeCellProps {
  id: string;
  task?: Task;
  isToday: boolean;
  onAddTask: () => void;
  onToggle: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
}

const TimeCell = ({ id, task, isToday, onAddTask, onToggle, onToggleSubtask, onDelete, onEdit }: TimeCellProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={id}
      className={cn(
        "relative min-h-[72px] border-l border-border/50 transition-colors group",
        isToday ? "bg-primary/[0.02]" : "bg-transparent",
        !task && "hover:bg-secondary/30"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {task ? (
        <div className="p-1 h-full">
          <TaskCard
            task={task}
            onToggle={onToggle}
            onToggleSubtask={onToggleSubtask}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ) : (
        isHovered && (
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
            onClick={onAddTask}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )
      )}
    </div>
  );
};

export default WeeklyTaskTable;
