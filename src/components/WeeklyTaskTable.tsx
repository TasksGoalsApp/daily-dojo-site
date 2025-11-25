import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  day: string;
  hour: number; // 24-hour format (e.g., 9 for 9 AM, 14 for 2 PM)
  priority: "low" | "medium" | "high";
  completed: boolean;
  subtasks: Subtask[];
  isWeekly?: boolean; // If true, task appears on all days
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM

const formatHour = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour} ${period}`;
};

// Mock data for demonstration
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTaskForCell = (day: string, hour: number) => {
    return tasks.find((task) => 
      task.hour === hour && (task.day === day || task.isWeekly)
    );
  };

  const handleAddTask = (day: string, hour: number) => {
    setSelectedDay(day);
    setSelectedHour(hour);
    setIsDialogOpen(true);
  };

  const handleCreateTask = (newTask: Omit<Task, "id">) => {
    if (editingTask) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...newTask, id: task.id } : task
        )
      );
      setEditingTask(null);
    } else {
      // Create new task
      const task: Task = {
        ...newTask,
        id: Date.now().toString(),
      };
      setTasks([...tasks, task]);
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
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask
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
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const [day, hourStr] = (over.id as string).split("-");
    const hour = parseInt(hourStr);

    // Check if the cell is already occupied
    const existingTask = getTaskForCell(day, hour);
    if (existingTask && existingTask.id !== taskId) {
      return; // Don't allow dropping on occupied cells
    }

    setTasks(
      tasks.map((task) =>
        task.id === taskId 
          ? { ...task, day, hour, isWeekly: false } // Convert weekly tasks to single day when moved
          : task
      )
    );
  };

  return (
    <div className="space-y-6">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-2 mb-2">
              <div className="w-20 text-sm font-semibold text-muted-foreground">Time</div>
              {DAYS.map((day) => (
                <div key={day} className="text-center">
                  <h3 className="font-semibold text-sm text-foreground">{day}</h3>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="space-y-1">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-8 gap-2">
                  {/* Hour Label */}
                  <div className="w-20 flex items-center justify-end pr-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatHour(hour)}
                    </span>
                  </div>

                  {/* Day Cells */}
                  {DAYS.map((day) => {
                    const task = getTaskForCell(day, hour);
                    const cellId = `${day}-${hour}`;

                    return (
                      <TimeCell
                        key={cellId}
                        id={cellId}
                        task={task}
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
  onAddTask: () => void;
  onToggle: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
}

const TimeCell = ({
  id,
  task,
  onAddTask,
  onToggle,
  onToggleSubtask,
  onDelete,
  onEdit,
}: TimeCellProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={id}
      className="relative min-h-[80px] border border-border rounded-md bg-card hover:bg-secondary/20 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {task ? (
        <TaskCard
          task={task}
          onToggle={onToggle}
          onToggleSubtask={onToggleSubtask}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ) : (
        <>
          {isHovered && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:text-primary hover:bg-secondary opacity-0 hover:opacity-100 transition-opacity"
              onClick={onAddTask}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default WeeklyTaskTable;
