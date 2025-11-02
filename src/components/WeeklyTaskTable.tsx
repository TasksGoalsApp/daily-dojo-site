import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskCard from "./TaskCard";
import AddTaskDialog from "./AddTaskDialog";

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  day: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  subtasks: Subtask[];
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Mock data for demonstration
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Team Meeting",
    day: "Monday",
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
    priority: "high",
    completed: true,
    subtasks: [],
  },
  {
    id: "4",
    title: "Workout Session",
    day: "Thursday",
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

  const getTasksForDay = (day: string) => {
    return tasks.filter((task) => task.day === day);
  };

  const handleAddTask = (day: string) => {
    setSelectedDay(day);
    setIsDialogOpen(true);
  };

  const handleCreateTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    };
    setTasks([...tasks, task]);
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <Card
            key={day}
            className="p-4 bg-card border-border hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">{day}</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-primary hover:text-primary hover:bg-secondary"
                  onClick={() => handleAddTask(day)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 min-h-[200px]">
                {getTasksForDay(day).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
                    onToggleSubtask={handleToggleSubtask}
                    onDelete={handleDeleteTask}
                  />
                ))}
                {getTasksForDay(day).length === 0 && (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
                    No tasks yet
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <AddTaskDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onCreateTask={handleCreateTask}
        selectedDay={selectedDay}
      />
    </div>
  );
};

export default WeeklyTaskTable;
